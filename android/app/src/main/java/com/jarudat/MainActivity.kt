package com.jarudat

import android.os.Bundle
import android.widget.FrameLayout
import android.view.Gravity
import com.facebook.react.ReactActivity
import com.facebook.react.ReactRootView
import com.facebook.react.ReactInstanceManager
import com.facebook.react.bridge.ReactContext
import com.facebook.FacebookSdk
import com.facebook.appevents.AppEventsLogger
import com.airbnb.lottie.LottieAnimationView
import android.os.Handler
import android.os.Looper

class MainActivity : ReactActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        // แสดง Lottie Animation Splash Screen
        val animationView = LottieAnimationView(this).apply {
            setAnimation(R.raw.splash_animation) // ใช้ไฟล์ JSON ใน res/raw
            loop(true)
            playAnimation()
        }

        val splashLayout = FrameLayout(this).apply {
            layoutParams = FrameLayout.LayoutParams(
                FrameLayout.LayoutParams.MATCH_PARENT,
                FrameLayout.LayoutParams.MATCH_PARENT
            )
            setBackgroundColor(android.graphics.Color.WHITE)
            addView(animationView)
        }

        setContentView(splashLayout)

        // ปิด Splash Screen หลังจาก 3 วินาที และโหลด React Native
        Handler(Looper.getMainLooper()).postDelayed({
            val reactRootView = ReactRootView(this)
            reactRootView.startReactApplication(
                reactNativeHost.reactInstanceManager,
                mainComponentName, // ชื่อคอมโพเนนต์ใน app.json
                null
            )
            setContentView(reactRootView) // เปลี่ยนจาก Splash Screen ไปเป็น React Native View
        }, 5000)

        // เริ่มต้น Facebook SDK
        FacebookSdk.sdkInitialize(application)
        AppEventsLogger.activateApp(application)
    }

    override fun getMainComponentName(): String? {
        return "jarudat"
    }
}
