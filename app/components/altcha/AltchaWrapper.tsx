'use client';
import 'altcha';
import { useEffect, useRef, useState, forwardRef, useImperativeHandle } from 'react'

interface AltchaProps {
    onStateChange?: (ev: Event | CustomEvent) => void
    expireMs?: number
}

export interface AltchaHandle {
    value: string | null
    reset: () => void
}

const Altcha = forwardRef<AltchaHandle, AltchaProps>(({ onStateChange, expireMs = 15000 }, ref) => {
    const widgetRef = useRef<AltchaWidget & AltchaWidgetMethods & HTMLElement>(null)
    const verifiedExpireTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
    const onStateChangeRef = useRef<AltchaProps['onStateChange']>(onStateChange)
    const expireMsRef = useRef(expireMs)
    const [value, setValue] = useState<string | null>(null)

    const clearVerifiedTimer = () => {  
        if (verifiedExpireTimerRef.current) {
            clearTimeout(verifiedExpireTimerRef.current)
            verifiedExpireTimerRef.current = null
        }
    }

    const schedulePostVerifyExpiry = () => {
        clearVerifiedTimer()
        verifiedExpireTimerRef.current = setTimeout(() => {
            widgetRef.current?.reset('expired')
        }, expireMsRef.current)
    }

    useEffect(() => {
        onStateChangeRef.current = onStateChange
    }, [onStateChange])

    useEffect(() => {
        expireMsRef.current = expireMs
    }, [expireMs])

    useEffect(() => {
        const handleStateChange = (ev: Event | CustomEvent) => {
            if ('detail' in ev) {
                const detail = ev.detail as { payload?: string; state?: string }
                setValue(detail.payload || null)

                // clear any pending expiry when challenge moves away from solved lifecycle
                if (detail.state === 'expired' || detail.state === 'unverified' || detail.state === 'error') {
                    clearVerifiedTimer()
                }

                onStateChangeRef.current?.(ev)
            }
        }

        const handleVerified = (ev: Event | CustomEvent) => {
            if ('detail' in ev) {
                const detail = ev.detail as { payload?: string }
                setValue(detail.payload || null)
            }

            // verified event is the reliable signal that solve succeeded
            schedulePostVerifyExpiry()
            onStateChangeRef.current?.(ev)
        }

        const { current } = widgetRef

        if (current) {
            current.addEventListener('statechange', handleStateChange)
            current.addEventListener('verified', handleVerified)
            return () => {
                current.removeEventListener('statechange', handleStateChange)
                current.removeEventListener('verified', handleVerified)
                clearVerifiedTimer()
            }
        }
    }, [])

    const reset = () => {
        widgetRef.current?.reset()
        clearVerifiedTimer()
        setValue(null)
    }

    useImperativeHandle(ref, () => {
        return {
            reset,
            value
        }
    }, [value])

    return (
        <altcha-widget
            ref={widgetRef}
            expire={expireMs}
            delay={0}
            challengeurl='/api/altcha/challenge'
        ></altcha-widget>
    )
})

export default Altcha
