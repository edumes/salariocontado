"use client"

import { Progress, ProgressTrack } from "@/components/animate-ui/base/progress"
import { AnimatedDigits } from "@/components/magicui/animated-digits"
import { LiquidGlassBadge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { CardContent, CardHeader, LiquidGlassCard } from "@/components/ui/liquid-glass-card"
import NumberInput from "@/components/ui/NumberInput"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { WallpaperToggle } from "@/components/ui/wallpaper-toggle"
import { AlertTriangle, Calendar, Clock, DollarSign, Settings, TrendingUp } from 'lucide-react'
import { useCallback, useEffect, useState } from "react"

interface WorkConfig {
  salaryType: 'monthly' | 'annual' | 'hourly'
  salaryAmount: number
  daysPerWeek: number
  workStartHour: number
  workEndHour: number
}

interface EarningsData {
  dailyEarnings: number
  dailyTarget: number
  weeklyTarget: number
  monthlyTarget: number
  earningsPerSecond: number
  weeklyEarnings: number
  monthlyEarnings: number
}

const STORAGE_KEY = 'earnings-tracker-config'

const getStoredConfig = (): WorkConfig => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      return JSON.parse(stored)
    }
  } catch (error) {
    console.error('Error loading config from localStorage:', error)
  }

  // Default configuration
  return {
    salaryType: 'monthly',
    salaryAmount: 3150,
    daysPerWeek: 5,
    workStartHour: 8,
    workEndHour: 17
  }
}

const saveConfig = (config: WorkConfig) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config))
  } catch (error) {
    console.error('Error saving config to localStorage:', error)
  }
}

export default function Page() {
  const [config, setConfig] = useState<WorkConfig>(getStoredConfig)
  const [earnings, setEarnings] = useState<EarningsData>({
    dailyEarnings: 0,
    dailyTarget: 0,
    weeklyTarget: 0,
    monthlyTarget: 0,
    earningsPerSecond: 0,
    weeklyEarnings: 0,
    monthlyEarnings: 0
  })
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [currentWallpaper, setCurrentWallpaper] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('current-wallpaper')
    }
    return null
  })
  const [currentWallpaperName, setCurrentWallpaperName] = useState<string | null>(null)

  // Save config to localStorage whenever it changes
  useEffect(() => {
    saveConfig(config)
  }, [config])

  const calculateEarningsPerSecond = useCallback((workConfig: WorkConfig): number => {
    let annualSalary: number

    switch (workConfig.salaryType) {
      case 'monthly':
        annualSalary = workConfig.salaryAmount * 12
        break
      case 'annual':
        annualSalary = workConfig.salaryAmount
        break
      case 'hourly':
        const workingDaysPerYear = 365 * (workConfig.daysPerWeek / 7)
        const actualWorkingHoursPerDay = workConfig.workEndHour - workConfig.workStartHour
        annualSalary = workConfig.salaryAmount * actualWorkingHoursPerDay * workingDaysPerYear
        break
      default:
        annualSalary = 0
    }

    const workingDaysPerYear = 365 * (workConfig.daysPerWeek / 7)
    const actualWorkingHoursPerDay = workConfig.workEndHour - workConfig.workStartHour
    const totalWorkingSecondsPerYear = workingDaysPerYear * actualWorkingHoursPerDay * 3600

    return annualSalary / totalWorkingSecondsPerYear
  }, [])

  const calculateTargets = useCallback((workConfig: WorkConfig) => {
    const earningsPerSecond = calculateEarningsPerSecond(workConfig)
    
    // Calculate actual working hours per day based on start and end times
    const actualWorkingHoursPerDay = workConfig.workEndHour - workConfig.workStartHour
    const secondsPerDay = actualWorkingHoursPerDay * 3600
    
    // Calculate daily target based on annual salary divided by working days per year
    const workingDaysPerYear = 365 * (workConfig.daysPerWeek / 7)
    let annualSalary: number
    
    switch (workConfig.salaryType) {
      case 'monthly':
        annualSalary = workConfig.salaryAmount * 12
        break
      case 'annual':
        annualSalary = workConfig.salaryAmount
        break
      case 'hourly':
        annualSalary = workConfig.salaryAmount * actualWorkingHoursPerDay * workingDaysPerYear
        break
      default:
        annualSalary = 0
    }
    
    const dailyTarget = annualSalary / workingDaysPerYear
    const weeklyTarget = dailyTarget * workConfig.daysPerWeek
    
    // Calculate monthly target based on average working days per month
    // Average month has ~21.67 working days (assuming 5-day work week)
    const averageWorkingDaysPerMonth = (workConfig.daysPerWeek / 7) * 30.44
    const monthlyTarget = dailyTarget * averageWorkingDaysPerMonth

    return {
      earningsPerSecond,
      dailyTarget,
      weeklyTarget,
      monthlyTarget
    }
  }, [calculateEarningsPerSecond])

  const isWorkingHours = useCallback(() => {
    const now = new Date()
    const currentHour = now.getHours()
    const currentDay = now.getDay() // 0 = Sunday, 1 = Monday, ..., 6 = Saturday

    // Check if it's a working day (Monday = 1, Tuesday = 2, ..., Friday = 5 for 5-day week)
    const isWorkingDay = currentDay >= 1 && currentDay <= config.daysPerWeek
    const isWorkingHour = currentHour >= config.workStartHour && currentHour < config.workEndHour

    return isWorkingDay && isWorkingHour
  }, [config.workStartHour, config.workEndHour, config.daysPerWeek])

  const calculateDailyEarnings = useCallback(() => {
    const now = new Date()
    const currentHour = now.getHours()
    const currentMinute = now.getMinutes()
    const currentSecond = now.getSeconds()
    const currentDay = now.getDay()

    // Check if today is a working day
    const isWorkingDay = currentDay >= 1 && currentDay <= config.daysPerWeek

    if (!isWorkingDay) {
      return 0 // No earnings on non-working days
    }

    // Calculate how many seconds have passed since work started today
    let secondsWorkedToday = 0
    const actualWorkingHoursPerDay = config.workEndHour - config.workStartHour

    if (isWorkingHours()) {
      // Currently working - calculate from work start time to now
      const workStartInSeconds = config.workStartHour * 3600
      const currentTimeInSeconds = currentHour * 3600 + currentMinute * 60 + currentSecond
      secondsWorkedToday = Math.max(0, currentTimeInSeconds - workStartInSeconds)
    } else if (currentHour >= config.workEndHour) {
      // Work day is over - calculate full work day
      secondsWorkedToday = actualWorkingHoursPerDay * 3600
    } else if (currentHour >= config.workStartHour) {
      // Work day has started but we're in working hours - calculate from start to now
      const workStartInSeconds = config.workStartHour * 3600
      const currentTimeInSeconds = currentHour * 3600 + currentMinute * 60 + currentSecond
      secondsWorkedToday = Math.max(0, currentTimeInSeconds - workStartInSeconds)
    }
    // If before work hours, secondsWorkedToday remains 0

    return secondsWorkedToday * earnings.earningsPerSecond
  }, [config.workStartHour, config.workEndHour, config.daysPerWeek, earnings.earningsPerSecond, isWorkingHours])

  const calculateWeeklyEarnings = useCallback(() => {
    const now = new Date()
    const currentDay = now.getDay() // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
    
    // Calculate how many working days have passed this week (excluding today)
    let completedWorkingDays = 0
    for (let day = 1; day < Math.min(currentDay, config.daysPerWeek + 1); day++) {
      completedWorkingDays++
    }
    
    // Calculate earnings from completed working days this week
    const completedDaysEarnings = completedWorkingDays * earnings.dailyTarget
    
    // Add today's earnings if it's a working day
    const todayEarnings = calculateDailyEarnings()
    
    return completedDaysEarnings + todayEarnings
  }, [config.daysPerWeek, earnings.dailyTarget, calculateDailyEarnings])

  const calculateMonthlyEarnings = useCallback(() => {
    const now = new Date()
    const currentDay = now.getDate()
    const currentMonth = now.getMonth()
    const currentYear = now.getFullYear()
    
    // Calculate how many working days have passed this month (excluding today)
    let completedWorkingDays = 0
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()
    
    for (let day = 1; day < currentDay; day++) {
      const date = new Date(currentYear, currentMonth, day)
      const dayOfWeek = date.getDay()
      if (dayOfWeek >= 1 && dayOfWeek <= config.daysPerWeek) {
        completedWorkingDays++
      }
    }
    
    // Calculate earnings from completed working days this month
    const completedDaysEarnings = completedWorkingDays * earnings.dailyTarget
    
    // Add today's earnings if it's a working day
    const todayEarnings = calculateDailyEarnings()
    
    return completedDaysEarnings + todayEarnings
  }, [config.daysPerWeek, earnings.dailyTarget, calculateDailyEarnings])

  useEffect(() => {
    const targets = calculateTargets(config)
    setEarnings(prev => ({
      ...prev,
      ...targets
    }))
  }, [config, calculateTargets])

  useEffect(() => {
    const interval = setInterval(() => {
      const dailyEarnings = calculateDailyEarnings()
      const weeklyEarnings = calculateWeeklyEarnings()
      const monthlyEarnings = calculateMonthlyEarnings()
      setEarnings(prev => ({
        ...prev,
        dailyEarnings: dailyEarnings,
        weeklyEarnings: weeklyEarnings,
        monthlyEarnings: monthlyEarnings
      }))
    }, 1000)

    return () => clearInterval(interval)
  }, [calculateDailyEarnings, calculateWeeklyEarnings, calculateMonthlyEarnings])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount)
  }

  const getProgressPercentage = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100)
  }

  const handleWallpaperChange = (wallpaperUrl: string, wallpaperName: string) => {
    setCurrentWallpaper(wallpaperUrl)
    setCurrentWallpaperName(wallpaperName)
    if (typeof window !== 'undefined') {
      localStorage.setItem('current-wallpaper', wallpaperUrl)
    }
  }

  return (
    <main className="min-h-screen relative overflow-hidden">
      {currentWallpaper && (
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-1000 ease-in-out"
          style={{ backgroundImage: `url(${currentWallpaper})` }}
        >
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
      )}
      
      {!currentWallpaper && (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black dark:from-gray-950 dark:via-gray-900 dark:to-black"></div>
      )}

      <WallpaperToggle onWallpaperChange={handleWallpaperChange} />
      
      {/* {currentWallpaperName && (
        <div className="fixed top-4 left-48 ml-2 z-50 bg-white/10 backdrop-blur-sm border border-white/20 text-white px-3 py-1 rounded-md text-sm">
          {currentWallpaperName}
        </div>
      )} */}
      
      {/* Fixed Theme Toggle in Top-Right Corner */}
      {/* <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div> */}

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Header */}
        <header className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-500 rounded-full mb-4">
            <DollarSign className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">Salário Contado</h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">Veja quanto você está ganhando em tempo real</p>
        </header>

        {/* Main Earnings Display */}
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            {/* Current Earnings Card */}
            <LiquidGlassCard className="lg:col-span-2" variant="primary" hover="glow">
              <CardHeader
                title="Ganhos Atual"
                className="text-center"
              />
              <CardContent className="text-center">
                <AnimatedDigits
                  value={formatCurrency(earnings.dailyEarnings)}
                  className="text-6xl font-bold text-emerald-600 dark:text-emerald-400 mb-6 font-mono"
                  duration={0.3}
                />

                <div className="flex items-center justify-center gap-4 mb-6">
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-200">
                    <Clock className="w-4 h-4 mr-2" />
                    <AnimatedDigits
                      value={formatCurrency(earnings.earningsPerSecond)}
                      duration={0.2}
                    />
                    /segundo
                  </div>
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-200">
                    <TrendingUp className="w-4 h-4 mr-2" />
                    <AnimatedDigits
                      value={formatCurrency(earnings.earningsPerSecond * 60)}
                      duration={0.2}
                    />
                    /minuto
                  </div>
                </div>
              </CardContent>
            </LiquidGlassCard>

            {/* Settings Card */}
            <LiquidGlassCard variant="secondary" hover="glow">
              <CardHeader
                title="Configurações"
                icon={
                  <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsDialogOpen(true)}
                      >
                        <Settings className="w-4 h-4 mr-2" />
                        Configurar
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Configurações de Trabalho</DialogTitle>
                        <DialogDescription>
                          Configure seus dados de trabalho para calcular os ganhos em tempo real.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                          <Label>Tipo de Salário</Label>
                          <Select
                            value={config.salaryType}
                            onValueChange={(value: string) => {
                              if (value === 'monthly' || value === 'annual' || value === 'hourly') {
                                setConfig(prev => ({ ...prev, salaryType: value }))
                              }
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o tipo de salário" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="monthly">Mensal</SelectItem>
                              <SelectItem value="annual">Anual</SelectItem>
                              <SelectItem value="hourly">Por Hora</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="grid gap-2">
                          <NumberInput
                            label="Valor do Salário"
                            value={config.salaryAmount}
                            onChange={(value) => setConfig(prev => ({ ...prev, salaryAmount: value }))}
                            min={0}
                            step={0.01}
                            showControls={false}
                            placeholder="Digite o valor do salário..."
                            formatOptions={{
                              style: 'currency',
                              currency: 'BRL',
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2
                            }}
                          />
                        </div>

                        <div className="grid gap-2">
                          <NumberInput
                            label="Dias por Semana"
                            value={config.daysPerWeek}
                            onChange={(value) => setConfig(prev => ({ ...prev, daysPerWeek: value }))}
                            min={1}
                            max={7}
                            step={1}
                            placeholder="Digite os dias por semana..."
                          />
                        </div>

                        <div className="grid gap-2">
                          <NumberInput
                            label="Horário de Início"
                            value={config.workStartHour}
                            onChange={(value) => setConfig(prev => ({ ...prev, workStartHour: value }))}
                            min={0}
                            max={23}
                            step={1}
                            placeholder="Digite o horário de início..."
                          />
                        </div>

                        <div className="grid gap-2">
                          <NumberInput
                            label="Horário de Término"
                            value={config.workEndHour}
                            onChange={(value) => setConfig(prev => ({ ...prev, workEndHour: value }))}
                            min={0}
                            max={23}
                            step={1}
                            placeholder="Digite o horário de término..."
                          />
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                }
              />
              <CardContent>
                <div className="text-sm text-gray-600 dark:text-gray-200">
                  <div className="flex justify-between mb-2">
                    <span>Horário de Trabalho:</span>
                    <span>{config.workStartHour}h às {config.workEndHour}h</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Status:</span>
                    <LiquidGlassBadge variant={isWorkingHours() ? "default" : "secondary"}>
                      {isWorkingHours() ? 'Horário de Trabalho' : 'Fora do Expediente'}
                    </LiquidGlassBadge>
                  </div>
                </div>
              </CardContent>
            </LiquidGlassCard>
          </div>

          {/* Progress Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Daily Progress */}
            <LiquidGlassCard variant="default" hover="glow">
              <CardHeader
                title="Meta Diária"
                icon={<Calendar className="w-5 h-5 text-blue-500" />}
              />
              <CardContent>
                <div className="mb-2">
                  <div className="flex justify-between text-sm text-gray-600 dark:text-gray-200 mb-1">
                    <span>Progresso</span>
                    <span>{Math.round(getProgressPercentage(earnings.dailyEarnings, earnings.dailyTarget))}%</span>
                  </div>
                  <Progress value={getProgressPercentage(earnings.dailyEarnings, earnings.dailyTarget)}>
                    <ProgressTrack color="bg-blue-500" />
                  </Progress>
                </div>
                <div className="text-lg font-bold text-gray-800 dark:text-white">{formatCurrency(earnings.dailyTarget)}</div>
              </CardContent>
            </LiquidGlassCard>

            {/* Weekly Progress */}
            <LiquidGlassCard variant="default" hover="glow">
              <CardHeader
                title="Meta Semanal"
                icon={<TrendingUp className="w-5 h-5 text-emerald-500" />}
              />
              <CardContent>
                <div className="mb-2">
                  <div className="flex justify-between text-sm text-gray-600 dark:text-gray-200 mb-1">
                    <span>Progresso</span>
                    <span>{Math.round(getProgressPercentage(earnings.weeklyEarnings, earnings.weeklyTarget))}%</span>
                  </div>
                  <Progress value={getProgressPercentage(earnings.weeklyEarnings, earnings.weeklyTarget)}>
                    <ProgressTrack color="bg-emerald-500" />
                  </Progress>
                </div>
                <div className="text-lg font-bold text-gray-800 dark:text-white">{formatCurrency(earnings.weeklyTarget)}</div>
              </CardContent>
            </LiquidGlassCard>

            {/* Monthly Progress */}
            <LiquidGlassCard variant="default" hover="glow">
              <CardHeader
                title="Meta Mensal"
                icon={<DollarSign className="w-5 h-5 text-indigo-500" />}
              />
              <CardContent>
                <div className="mb-2">
                  <div className="flex justify-between text-sm text-gray-600 dark:text-gray-200 mb-1">
                    <span>Progresso</span>
                    <span>{Math.round(getProgressPercentage(earnings.monthlyEarnings, earnings.monthlyTarget))}%</span>
                  </div>
                  <Progress value={getProgressPercentage(earnings.monthlyEarnings, earnings.monthlyTarget)}>
                    <ProgressTrack color="bg-indigo-500" />
                  </Progress>
                </div>
                <div className="text-lg font-bold text-gray-800 dark:text-white">{formatCurrency(earnings.monthlyTarget)}</div>
              </CardContent>
            </LiquidGlassCard>
          </div>

          {/* Stats Footer */}
          <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-200">
            {!isWorkingHours() && (
              <p className="text-orange-600 dark:text-orange-400 font-medium flex items-center justify-center gap-2">
                <AlertTriangle />
                Atualmente fora do horário de trabalho configurado
              </p>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
