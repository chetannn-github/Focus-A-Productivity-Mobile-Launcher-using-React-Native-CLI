package com.focuslauncher

import android.accessibilityservice.AccessibilityService
import android.content.Intent
import android.view.accessibility.AccessibilityEvent

class LockAccessibilityService : AccessibilityService() {

    companion object {
        var instance: LockAccessibilityService? = null
    }

    override fun onServiceConnected() {
        super.onServiceConnected()
        instance = this
    }

    override fun onAccessibilityEvent(event: AccessibilityEvent?) {
        // Hame events read nahi karne, bas lock karna hai
    }

    override fun onInterrupt() {}

    override fun onUnbind(intent: Intent?): Boolean {
        instance = null
        return super.onUnbind(intent)
    }

    // YEH FUNCTION FINGERPRINT KO BINA ROKE LOCK KAREGA
    fun performLock() {
        performGlobalAction(GLOBAL_ACTION_LOCK_SCREEN)
    }
}