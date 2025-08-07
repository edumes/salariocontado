"use client"

import { ThemeToggle } from "@/components/ui/theme-toggle"
import { Calendar, Clock, DollarSign, Settings, TrendingUp } from 'lucide-react'
import { useCallback, useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { LiquidGlassCard, CardHeader, CardContent } from "@/components/kokonutui/liquid-glass-card"

interface WorkConfig {
  salaryType: 'monthly' | 'annual' | 'hourly'
  salaryAmount: number
  hoursPerDay: number
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
    hoursPerDay: 8,
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
    earningsPerSecond: 0
  })
  const [isDialogOpen, setIsDialogOpen] = useState(false)

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
        annualSalary = workConfig.salaryAmount * workConfig.hoursPerDay * workingDaysPerYear
        break
      default:
        annualSalary = 0
    }

    const workingDaysPerYear = 365 * (workConfig.daysPerWeek / 7)
    const totalWorkingSecondsPerYear = workingDaysPerYear * workConfig.hoursPerDay * 3600

    return annualSalary / totalWorkingSecondsPerYear
  }, [])

  const calculateTargets = useCallback((workConfig: WorkConfig) => {
    const earningsPerSecond = calculateEarningsPerSecond(workConfig)
    const secondsPerDay = workConfig.hoursPerDay * 3600
    const dailyTarget = earningsPerSecond * secondsPerDay
    const weeklyTarget = dailyTarget * workConfig.daysPerWeek
    const monthlyTarget = dailyTarget * (workConfig.daysPerWeek / 7) * 30.44 // Average days per month

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
    const currentDay = now.getDay()

    // Check if it's a working day (assuming Monday = 1, Sunday = 0)
    const isWorkingDay = currentDay >= 1 && currentDay <= config.daysPerWeek
    const isWorkingHour = currentHour >= config.workStartHour && currentHour < config.workEndHour

    return isWorkingDay && isWorkingHour
  }, [config.workStartHour, config.workEndHour, config.daysPerWeek])

  const calculateDailyEarnings = useCallback(() => {
    const now = new Date()
    const currentHour = now.getHours()
    const currentMinute = now.getMinutes()
    const currentSecond = now.getSeconds()

    // Calculate how many seconds have passed since work started today
    let secondsWorkedToday = 0

    if (isWorkingHours()) {
      // Currently working - calculate from work start time to now
      const workStartInSeconds = config.workStartHour * 3600
      const currentTimeInSeconds = currentHour * 3600 + currentMinute * 60 + currentSecond
      secondsWorkedToday = Math.max(0, currentTimeInSeconds - workStartInSeconds)
    } else if (currentHour >= config.workEndHour) {
      // Work day is over - calculate full work day
      secondsWorkedToday = config.hoursPerDay * 3600
    }
    // If before work hours, secondsWorkedToday remains 0

    return secondsWorkedToday * earnings.earningsPerSecond
  }, [config.workStartHour, config.workEndHour, config.hoursPerDay, earnings.earningsPerSecond, isWorkingHours])

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
      setEarnings(prev => ({
        ...prev,
        dailyEarnings: dailyEarnings
      }))
    }, 1000)

    return () => clearInterval(interval)
  }, [calculateDailyEarnings])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount)
  }

  const getProgressPercentage = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100)
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black dark:from-gray-950 dark:via-gray-900 dark:to-black">
      {/* Fixed Theme Toggle in Top-Right Corner */}
      {/* <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div> */}

      <div className="container mx-auto px-4 py-8">
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
                <div className="text-6xl font-bold text-emerald-600 dark:text-emerald-400 mb-6 font-mono transition-all duration-300">
                  {formatCurrency(earnings.dailyEarnings)}
                </div>

                <div className="flex items-center justify-center gap-4 mb-6">
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <Clock className="w-4 h-4 mr-2" />
                    {formatCurrency(earnings.earningsPerSecond)}/segundo
                  </div>
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <TrendingUp className="w-4 h-4 mr-2" />
                    {formatCurrency(earnings.earningsPerSecond * 60)}/minuto
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
                          <Label htmlFor="salary-type">Tipo de Salário</Label>
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
                          <Label htmlFor="salary-amount">Valor do Salário (R$)</Label>
                          <Input
                            id="salary-amount"
                            type="number"
                            min="0"
                            step="0.01"
                            value={config.salaryAmount}
                            onChange={(e) => {
                              const value = Number(e.target.value)
                              if (!isNaN(value) && value >= 0) {
                                setConfig(prev => ({ ...prev, salaryAmount: value }))
                              }
                            }}
                          />
                        </div>

                        <div className="grid gap-2">
                          <Label htmlFor="hours-per-day">Horas por Dia</Label>
                          <Input
                            id="hours-per-day"
                            type="number"
                            min="1"
                            max="24"
                            value={config.hoursPerDay}
                            onChange={(e) => {
                              const value = Number(e.target.value)
                              if (!isNaN(value) && value >= 1 && value <= 24) {
                                setConfig(prev => ({ ...prev, hoursPerDay: value }))
                              }
                            }}
                          />
                        </div>

                        <div className="grid gap-2">
                          <Label htmlFor="days-per-week">Dias por Semana</Label>
                          <Input
                            id="days-per-week"
                            type="number"
                            min="1"
                            max="7"
                            value={config.daysPerWeek}
                            onChange={(e) => {
                              const value = Number(e.target.value)
                              if (!isNaN(value) && value >= 1 && value <= 7) {
                                setConfig(prev => ({ ...prev, daysPerWeek: value }))
                              }
                            }}
                          />
                        </div>

                        <div className="grid gap-2">
                          <Label htmlFor="work-start-hour">Horário de Início</Label>
                          <Input
                            id="work-start-hour"
                            type="number"
                            min="0"
                            max="23"
                            value={config.workStartHour}
                            onChange={(e) => {
                              const value = Number(e.target.value)
                              if (!isNaN(value) && value >= 0 && value <= 23) {
                                setConfig(prev => ({ ...prev, workStartHour: value }))
                              }
                            }}
                          />
                        </div>

                        <div className="grid gap-2">
                          <Label htmlFor="work-end-hour">Horário de Término</Label>
                          <Input
                            id="work-end-hour"
                            type="number"
                            min="0"
                            max="23"
                            value={config.workEndHour}
                            onChange={(e) => {
                              const value = Number(e.target.value)
                              if (!isNaN(value) && value >= 0 && value <= 23) {
                                setConfig(prev => ({ ...prev, workEndHour: value }))
                              }
                            }}
                          />
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                }
              />
              <CardContent>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex justify-between mb-2">
                    <span>Horário de Trabalho:</span>
                    <span>{config.workStartHour}h às {config.workEndHour}h</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Status:</span>
                    <Badge variant={isWorkingHours() ? "default" : "secondary"}>
                      {isWorkingHours() ? 'Horário de Trabalho' : 'Fora do Expediente'}
                    </Badge>
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
                  <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
                    <span>Progresso</span>
                    <span>{Math.round(getProgressPercentage(earnings.dailyEarnings, earnings.dailyTarget))}%</span>
                  </div>
                  <Progress value={getProgressPercentage(earnings.dailyEarnings, earnings.dailyTarget)} className="mb-2" />
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
                  <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
                    <span>Progresso</span>
                    <span>{Math.round(getProgressPercentage(earnings.dailyEarnings, earnings.weeklyTarget))}%</span>
                  </div>
                  <Progress value={getProgressPercentage(earnings.dailyEarnings, earnings.weeklyTarget)} className="mb-2" />
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
                  <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
                    <span>Progresso</span>
                    <span>{Math.round(getProgressPercentage(earnings.dailyEarnings, earnings.monthlyTarget))}%</span>
                  </div>
                  <Progress value={getProgressPercentage(earnings.dailyEarnings, earnings.monthlyTarget)} className="mb-2" />
                </div>
                <div className="text-lg font-bold text-gray-800 dark:text-white">{formatCurrency(earnings.monthlyTarget)}</div>
              </CardContent>
            </LiquidGlassCard>
          </div>

          {/* Stats Footer */}
          <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
            {!isWorkingHours() && (
              <p className="text-orange-600 dark:text-orange-400 font-medium">⚠️ Atualmente fora do horário de trabalho configurado</p>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
