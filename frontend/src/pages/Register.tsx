import { motion, type Variants } from 'framer-motion'
import { useState, type ChangeEvent, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '../hooks/auth'

type RegisterFormState = {
    username: string
    password: string
    confirmPassword: string
}

const pageVariants: Variants = {
    hidden: { opacity: 0, x: 24 },
    show: {
        opacity: 1,
        x: 0,
        transition: { duration: 0.45, ease: 'easeOut' },
    },
    exit: {
        opacity: 0,
        x: -24,
        transition: { duration: 0.3, ease: 'easeIn' },
    },
}

const containerVariants: Variants = {
    hidden: { opacity: 0, y: 16 },
    show: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.5,
            ease: 'easeOut',
            staggerChildren: 0.08,
        },
    },
}

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 12 },
    show: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.35, ease: 'easeOut' },
    },
}

const glowVariants: Variants = {
    hidden: { opacity: 0, scale: 0.95 },
    show: {
        opacity: 1,
        scale: 1,
        transition: { duration: 0.8, ease: 'easeOut' },
    },
}

const RegisterPage = () => {
    const { t } = useTranslation()
    const { register } = useAuth()
    const [formState, setFormState] = useState<RegisterFormState>({
        username: '',
        password: '',
        confirmPassword: '',
    })
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [errorMessage, setErrorMessage] = useState<string | null>(null)

    const handleChange =
        (field: keyof RegisterFormState) =>
            (event: ChangeEvent<HTMLInputElement>) => {
                setFormState((prev) => ({ ...prev, [field]: event.target.value }))
                if (errorMessage) {
                    setErrorMessage(null)
                }
            }

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setIsSubmitting(true)
        setErrorMessage(null)

        if (formState.password !== formState.confirmPassword) {
            setErrorMessage(t('register.errors.passwordMismatch'))
            setIsSubmitting(false)
            return
        }

        try {
            await register({
                username: formState.username.trim(),
                password: formState.password,
                confirmPassword: formState.confirmPassword,
            })
        } catch (error) {
            const message =
                error instanceof Error && error.message
                    ? error.message
                    : t('register.errors.generic')
            setErrorMessage(message)
        } finally {
            setIsSubmitting(false)
        }
    }

    const trimmedUsername = formState.username.trim()
    const canSubmit =
        trimmedUsername.length > 0 &&
        formState.password.length > 0 &&
        formState.confirmPassword.length > 0

    return (
        <motion.main
            className="relative flex min-h-[100svh] items-center justify-center overflow-hidden bg-gradient-to-br from-slate-50 via-cyan-50 to-slate-100 px-4 py-16 text-left dark:from-slate-950 dark:via-slate-900 dark:to-slate-950"
            variants={pageVariants}
            initial="hidden"
            animate="show"
            exit="exit"
        >
            <div className="pointer-events-none absolute inset-0">
                <motion.div
                    className="absolute -top-32 left-[12%] h-64 w-64 rounded-full bg-cyan-400/20 blur-3xl dark:bg-cyan-400/10"
                    variants={glowVariants}
                    initial="hidden"
                    animate="show"
                />
                <motion.div
                    className="absolute bottom-[-140px] right-[-10px] h-72 w-72 rounded-full bg-lime-300/20 blur-3xl dark:bg-lime-300/10"
                    variants={glowVariants}
                    initial="hidden"
                    animate="show"
                />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(8,145,178,0.16),_transparent_45%)] dark:bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.12),_transparent_45%)]" />
            </div>

            <motion.div
                className="relative z-10 w-full max-w-md"
                variants={containerVariants}
                initial="hidden"
                animate="show"
            >
                <motion.div variants={itemVariants} className="mb-6 text-center">
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-700 ring-1 ring-cyan-500/30 dark:bg-cyan-400/10 dark:text-cyan-300">
                        <div
                            className="h-5 w-5 rounded-full bg-gradient-to-br from-cyan-500/80 to-lime-400/80"
                            aria-hidden="true"
                        />
                    </div>
                    <h1 className="text-3xl font-semibold text-foreground md:text-4xl">
                        {t('register.title')}
                    </h1>
                    <p className="mt-2 text-sm text-muted-foreground">
                        {t('register.subtitle')}
                    </p>
                </motion.div>

                <motion.div variants={itemVariants}>
                    <Card className="border-border/60 bg-background/80 shadow-lg shadow-cyan-500/10 backdrop-blur">
                        <CardHeader className="space-y-3">
                            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-cyan-700/70 dark:text-cyan-300/80">
                                <span className="h-2 w-2 rounded-full bg-cyan-500" aria-hidden="true" />
                                {t('register.kicker')}
                            </div>
                            <CardTitle className="text-2xl md:text-3xl">
                                {t('register.cardTitle')}
                            </CardTitle>
                            <CardDescription>{t('register.cardDescription')}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {errorMessage ? (
                                <motion.div variants={itemVariants}>
                                    <Alert variant="destructive">
                                        <AlertTitle>{t('register.errors.title')}</AlertTitle>
                                        <AlertDescription>{errorMessage}</AlertDescription>
                                    </Alert>
                                </motion.div>
                            ) : null}

                            <motion.form
                                variants={itemVariants}
                                className="space-y-4"
                                onSubmit={handleSubmit}
                                aria-busy={isSubmitting}
                            >
                                <div className="space-y-2">
                                    <Label htmlFor="username">{t('register.form.username.label')}</Label>
                                    <Input
                                        id="username"
                                        name="username"
                                        autoComplete="username"
                                        placeholder={t('register.form.username.placeholder')}
                                        value={formState.username}
                                        onChange={handleChange('username')}
                                        disabled={isSubmitting}
                                        required
                                        aria-invalid={Boolean(errorMessage)}
                                        aria-label={t('register.form.username.ariaLabel')}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="password">{t('register.form.password.label')}</Label>
                                    <Input
                                        id="password"
                                        name="password"
                                        type="password"
                                        autoComplete="new-password"
                                        placeholder={t('register.form.password.placeholder')}
                                        value={formState.password}
                                        onChange={handleChange('password')}
                                        disabled={isSubmitting}
                                        required
                                        aria-invalid={Boolean(errorMessage)}
                                        aria-label={t('register.form.password.ariaLabel')}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="confirmPassword">
                                        {t('register.form.confirmPassword.label')}
                                    </Label>
                                    <Input
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        type="password"
                                        autoComplete="new-password"
                                        placeholder={t('register.form.confirmPassword.placeholder')}
                                        value={formState.confirmPassword}
                                        onChange={handleChange('confirmPassword')}
                                        disabled={isSubmitting}
                                        required
                                        aria-invalid={Boolean(errorMessage)}
                                        aria-label={t('register.form.confirmPassword.ariaLabel')}
                                    />
                                </div>
                                <div className="pt-2">
                                    <Button
                                        type="submit"
                                        size="lg"
                                        className="w-full"
                                        disabled={!canSubmit || isSubmitting}
                                    >
                                        {isSubmitting
                                            ? t('register.actions.loading')
                                            : t('register.actions.submit')}
                                    </Button>
                                </div>
                            </motion.form>
                        </CardContent>
                        <CardFooter className="flex flex-col gap-3 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
                            <span>{t('register.footer.prompt')}</span>
                            <Button asChild variant="link" size="sm" className="px-0">
                                <Link to="/login">{t('register.footer.cta')}</Link>
                            </Button>
                        </CardFooter>
                    </Card>
                </motion.div>
            </motion.div>
        </motion.main>
    )
}

export default RegisterPage
