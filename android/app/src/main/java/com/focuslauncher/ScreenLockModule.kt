package com.focuslauncher

import android.content.Context
import android.content.Intent
import android.graphics.Color
import android.graphics.PixelFormat
import android.graphics.Typeface
import android.graphics.drawable.GradientDrawable
import android.os.Build
import android.os.Handler
import android.os.Looper
import android.provider.Settings
import android.text.TextUtils
import android.view.Gravity
import android.view.WindowManager
import android.widget.TextView
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

class ScreenLockModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String {
        return "ScreenLock"
    }

    private fun isAccessibilityEnabled(): Boolean {
        val expectedComponentName = reactApplicationContext.packageName + "/" + LockAccessibilityService::class.java.name
        val enabledServicesSetting = Settings.Secure.getString(reactApplicationContext.contentResolver, Settings.Secure.ENABLED_ACCESSIBILITY_SERVICES)
        if (enabledServicesSetting.isNullOrEmpty()) return false
        return enabledServicesSetting.contains(expectedComponentName)
    }

    private fun showModernToast(message: String) {
        val context = reactApplicationContext
        val windowManager = context.getSystemService(Context.WINDOW_SERVICE) as WindowManager

        val textView = TextView(context)
        textView.text = message
        textView.setTextColor(Color.WHITE)
        textView.textSize = 14f
        textView.typeface = Typeface.create("sans-serif-medium", Typeface.NORMAL)
        textView.setPadding(60, 30, 60, 30)
        textView.gravity = Gravity.CENTER
        val shape = GradientDrawable()
        shape.cornerRadius = 100f // Full round
        shape.setColor(Color.parseColor("#E6121212")) 
        shape.setStroke(1, Color.parseColor("#33FFFFFF")) // Subtle White Border
        textView.background = shape

        val layoutType = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            WindowManager.LayoutParams.TYPE_APPLICATION_OVERLAY
        } else {
            WindowManager.LayoutParams.TYPE_PHONE
        }

        val params = WindowManager.LayoutParams(
            WindowManager.LayoutParams.WRAP_CONTENT,
            WindowManager.LayoutParams.WRAP_CONTENT,
            layoutType,
            WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE or WindowManager.LayoutParams.FLAG_NOT_TOUCHABLE,
            PixelFormat.TRANSLUCENT
        )
        params.gravity = Gravity.BOTTOM
        params.y = 150 

        Handler(Looper.getMainLooper()).post {
            try {
                windowManager.addView(textView, params)
                Handler(Looper.getMainLooper()).postDelayed({
                    try { windowManager.removeView(textView) } catch (e: Exception) {}
                }, 5000)
            } catch (e: Exception) {
                android.widget.Toast.makeText(context, message, android.widget.Toast.LENGTH_LONG).show()
            }
        }
    }

    @ReactMethod
    fun hasPermission(promise: Promise) {
        promise.resolve(isAccessibilityEnabled())
    }

    @ReactMethod
    fun requestPermission() {
        if (!isAccessibilityEnabled()) {
            val intent = Intent(Settings.ACTION_ACCESSIBILITY_SETTINGS)
            intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
        
            showModernToast("Scroll down > Installed Apps > Focus")
            
            reactApplicationContext.startActivity(intent)
        }
    }

    @ReactMethod
    fun lockDevice() {
        if (isAccessibilityEnabled()) {
            LockAccessibilityService.instance?.performLock()
        } else {
            requestPermission()
        }
    }
}