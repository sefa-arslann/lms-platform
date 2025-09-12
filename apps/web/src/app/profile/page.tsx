"use client"

import Link from "next/link"
import { useState, useEffect, useContext } from "react"
import ProtectedRoute from "@/components/ProtectedRoute"
import SecureStorage from "@/utils/secureStorage"
import { AuthContext } from "@/contexts/AuthContext"
import { formatDurationShort } from "@/utils/duration"

// Custom CSS for animations
const customStyles = `
  @keyframes fade-in {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  @keyframes slide-in-left {
    from { opacity: 0; transform: translateX(-30px); }
    to { opacity: 1; transform: translateX(0); }
  }
  
  @keyframes slide-in-right {
    from { opacity: 0; transform: translateX(30px); }
    to { opacity: 1; transform: translateX(0); }
  }
  
  .animate-fade-in {
    animation: fade-in 0.6s ease-out;
  }
  
  .animate-slide-in-left {
    animation: slide-in-left 0.6s ease-out;
  }
  
  .animate-slide-in-right {
    animation: slide-in-right 0.6s ease-out;
  }
  
  .animate-bounce {
    animation: bounce 2s infinite;
  }
  
  .animate-pulse {
    animation: pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  }
`;

interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  avatar?: string
  createdAt: string
  bio?: string
  level?: string
  phone?: string
  website?: string
}

interface UserCourse {
  id: string
  title: string
  progress: number
  lastAccessed: string
  image?: string
  slug?: string
  expiresAt?: string
  accessGrantId?: string
  totalLessons: number
  completedLessons: number
  totalDuration: number
  duration: number
  remainingTime: number | null
}

interface LastWatchedCourse {
  id: string
  slug: string
  title: string
  lastLessonId: string
  lastPosition: number
  lastSectionId: string
  progress: number
}

interface UserOrder {
  id: string
  orderNumber: string
  amount: string
  currency: string
  status: string
  purchasedAt: string
  courseId: string
  courseTitle: string
  expiresAt: string
  billingInfo?: any
}

interface UserDevice {
  id: string
  deviceName: string
  platform: string
  model: string
  isTrusted: boolean
  isActive: boolean
  lastSeenAt: string
  createdAt: string
  userAgent: string
  osVersion: string
  appVersion: string
  firstIp: string
  lastIp: string
  approvedAt: string
  installId: string
  updatedAt?: string
}

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("overview")
  const [isEditing, setIsEditing] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [recentCourses, setRecentCourses] = useState<UserCourse[]>([])
  const [userOrders, setUserOrders] = useState<UserOrder[]>([])
  const [userDevices, setUserDevice] = useState<UserDevice[]>([])
  const [lastWatchedCourse, setLastWatchedCourse] = useState<LastWatchedCourse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [stats, setStats] = useState({
    totalCourses: 0,
    completedLessons: 0,
    totalLessons: 0,
    averageProgress: 0,
  })
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const authContext = useContext(AuthContext)
  const userFromContext = authContext?.user

  // Device detection function
  const getDeviceInfo = () => {
    const userAgent = navigator.userAgent
    const platform = navigator.platform || "Unknown"
    
    let osVersion = "Unknown"
    if (userAgent.includes("Windows")) {
      osVersion = "Windows"
      if (userAgent.includes("Windows NT 10.0")) osVersion = "Windows 10/11"
      else if (userAgent.includes("Windows NT 6.3")) osVersion = "Windows 8.1"
      else if (userAgent.includes("Windows NT 6.2")) osVersion = "Windows 8"
      else if (userAgent.includes("Windows NT 6.1")) osVersion = "Windows 7"
    } else if (userAgent.includes("Mac OS X")) {
      osVersion = "macOS"
      const match = userAgent.match(/Mac OS X (\d+[._]\d+)/)
      if (match) osVersion = `macOS ${match[1].replace("_", ".")}`
    } else if (userAgent.includes("Linux")) {
      osVersion = "Linux"
    } else if (userAgent.includes("Android")) {
      osVersion = "Android"
      const match = userAgent.match(/Android (\d+\.\d+)/)
      if (match) osVersion = `Android ${match[1]}`
    } else if (userAgent.includes("iOS")) {
      osVersion = "iOS"
      const match = userAgent.match(/OS (\d+[._]\d+)/)
      if (match) osVersion = `iOS ${match[1].replace("_", ".")}`
    }

    let appVersion = "Unknown"
    if (userAgent.includes("Chrome")) {
      appVersion = "Chrome"
      const match = userAgent.match(/Chrome\/(\d+\.\d+)/)
      if (match) appVersion = `Chrome ${match[1]}`
    } else if (userAgent.includes("Firefox")) {
      appVersion = "Firefox"
      const match = userAgent.match(/Firefox\/(\d+\.\d+)/)
      if (match) appVersion = `Firefox ${match[1]}`
    } else if (userAgent.includes("Safari")) {
      appVersion = "Safari"
      const match = userAgent.match(/Version\/(\d+\.\d+)/)
      if (match) appVersion = `Safari ${match[1]}`
    } else if (userAgent.includes("Edge")) {
      appVersion = "Edge"
      const match = userAgent.match(/Edge\/(\d+\.\d+)/)
      if (match) appVersion = `Edge ${match[1]}`
    }

    let model = "Unknown"
    if (userAgent.includes("iPhone")) {
      model = "iPhone"
      const match = userAgent.match(/iPhone OS (\d+[._]\d+)/)
      if (match) model = `iPhone (iOS ${match[1].replace("_", ".")})`
    } else if (userAgent.includes("iPad")) {
      model = "iPad"
      const match = userAgent.match(/OS (\d+[._]\d+)/)
      if (match) model = `iPad (iOS ${match[1].replace("_", ".")})`
    } else if (userAgent.includes("Android")) {
      if (userAgent.includes("Mobile")) {
        model = "Android Mobile"
      } else {
        model = "Android Tablet"
      }
    } else if (userAgent.includes("Macintosh")) {
      model = "Mac"
    } else if (userAgent.includes("Windows")) {
      model = "PC"
    }

    return {
      userAgent,
      platform,
      osVersion,
      appVersion,
      model,
      screenResolution: `${screen.width}x${screen.height}`,
      colorDepth: screen.colorDepth,
      language: navigator.language,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      cookieEnabled: navigator.cookieEnabled,
      onLine: navigator.onLine,
    }
  }

  const getIPAddress = async () => {
    try {
      const response = await fetch("https://api.ipify.org?format=json")
      const data = await response.json()
      return data.ip
    } catch (error) {
      return "127.0.0.1"
    }
  }

  useEffect(() => {
  const fetchUserData = async () => {
    try {
      setLoading(true)
      const token = SecureStorage.getToken()
      
      if (!token) {
        if (userFromContext) {
          setUser({
            id: userFromContext.id,
            firstName: userFromContext.firstName,
            lastName: userFromContext.lastName,
            email: userFromContext.email,
            createdAt: new Date().toISOString(),
            bio: "",
            level: "Başlangıç",
            phone: "",
            website: "",
          })
        }
        setLoading(false)
        return
      }

        // Auto-register device
        try {
          const deviceInfo = getDeviceInfo()
          const ipAddress = await getIPAddress()
          const deviceData = {
            deviceName: `${deviceInfo.platform} - ${deviceInfo.appVersion}`,
            platform: deviceInfo.platform,
            model: deviceInfo.model,
            userAgent: deviceInfo.userAgent,
            osVersion: deviceInfo.osVersion,
            appVersion: deviceInfo.appVersion,
            screenResolution: deviceInfo.screenResolution,
            colorDepth: deviceInfo.colorDepth,
            language: deviceInfo.language,
            timezone: deviceInfo.timezone,
            cookieEnabled: deviceInfo.cookieEnabled,
            onLine: deviceInfo.onLine,
            ip: ipAddress,
          }

          await fetch("http://localhost:3001/devices/enroll", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(deviceData),
          })
    } catch (error) {
          console.log("Device registration error:", error)
        }

        // Fetch user profile
        try {
          const profileResponse = await fetch("http://localhost:3001/users/profile", {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          })

          if (profileResponse.ok) {
            const profileData = await profileResponse.json()
        setUser(profileData)
      } else if (userFromContext) {
        setUser({
          id: userFromContext.id,
          firstName: userFromContext.firstName,
          lastName: userFromContext.lastName,
          email: userFromContext.email,
              createdAt: new Date().toISOString(),
          bio: "",
          level: "Başlangıç",
          phone: "",
          website: "",
        })
      }
    } catch (error) {
          if (userFromContext) {
            setUser({
              id: userFromContext.id,
              firstName: userFromContext.firstName,
              lastName: userFromContext.lastName,
              email: userFromContext.email,
              createdAt: new Date().toISOString(),
              bio: "",
              level: "Başlangıç",
              phone: "",
              website: "",
            })
          }
        }

        // Fetch user courses
        try {
          const coursesResponse = await fetch("http://localhost:3001/access-grants/my-courses", {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          })

          if (coursesResponse.ok) {
            const coursesData = await coursesResponse.json()
        setRecentCourses(coursesData)
        
        const totalCourses = coursesData.length
        const totalLessons = coursesData.reduce((sum: number, course: any) => sum + (course.totalLessons || 0), 0)
            const completedLessons = coursesData.reduce(
              (sum: number, course: any) => sum + (course.completedLessons || 0),
              0,
            )
            const averageProgress =
              totalCourses > 0
                ? Math.round(
                    coursesData.reduce((sum: number, course: any) => sum + (course.progress || 0), 0) / totalCourses,
                  )
                : 0

            setStats({
              totalCourses,
              totalLessons,
              completedLessons,
              averageProgress,
            })
      }
    } catch (error) {
          setRecentCourses([])
          setStats({
            totalCourses: 0,
            totalLessons: 0,
            completedLessons: 0,
            averageProgress: 0,
          })
        }

        // Fetch user orders
        try {
          const ordersResponse = await fetch("http://localhost:3001/orders/my-orders", {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          })

          if (ordersResponse.ok) {
            const ordersData = await ordersResponse.json()
        setUserOrders(ordersData)
      }
    } catch (error) {
          setUserOrders([])
        }

                // Fetch user devices
        try {
          const devicesResponse = await fetch("http://localhost:3001/devices/my-devices", {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          })

          if (devicesResponse.ok) {
            const devicesData = await devicesResponse.json()
            setUserDevice(devicesData)
          }
        } catch (error) {
          setUserDevice([])
        }

        // Fetch last watched course
        try {
          const lastWatchedResponse = await fetch("http://localhost:3001/lesson-progress/user/last-watched", {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          })

          if (lastWatchedResponse.ok) {
            const lastWatchedData = await lastWatchedResponse.json()
            setLastWatchedCourse(lastWatchedData)
      }
    } catch (error) {
          console.log("Error fetching last watched course:", error)
          setLastWatchedCourse(null)
        }

      } catch (error) {
        setError("Kullanıcı bilgileri yüklenirken hata oluştu")
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [userFromContext])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="text-red-600 text-xl mb-4">Hata!</div>
            <div className="text-gray-600 mb-4">{error || "Kullanıcı bulunamadı"}</div>
          <Link href="/login" className="text-blue-600 hover:underline">Giriş yap</Link>
        </div>
      </div>
    )
  }

  return (
    <ProtectedRoute>
      <style jsx global>{customStyles}</style>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          {/* Header Section */}
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 p-8 mb-8 overflow-hidden relative">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-indigo-500/5 to-purple-500/5"></div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-blue-400/10 to-transparent rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-indigo-400/10 to-transparent rounded-full blur-2xl animate-pulse" style={{animationDelay: '1s'}}></div>
            
            <div className="relative flex flex-col md:flex-row items-start md:items-center space-y-6 md:space-y-0 md:space-x-8">
              <div className="relative group">
                <div className="w-32 h-32 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center text-white text-4xl font-bold shadow-2xl transform group-hover:scale-105 transition-all duration-300">
                  {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                </div>
                <div className="absolute -bottom-3 -right-3 w-10 h-10 bg-emerald-500 rounded-xl border-4 border-white flex items-center justify-center shadow-lg animate-bounce">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-600/20 to-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>

              <div className="flex-1">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-800 bg-clip-text text-transparent mb-3 animate-fade-in">
                  {user.firstName} {user.lastName}
                </h1>
                <p className="text-gray-600 mb-2 text-lg">{user.email}</p>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0h6m-6 0l-1 12a2 2 0 002 2h6a2 2 0 002-2L16 7" />
                  </svg>
                  <span>Üye olma: {user.createdAt ? new Date(user.createdAt).toLocaleDateString("tr-TR", {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  }) : 'Bilinmiyor'}</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 text-center border border-white/30 shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300">
                  <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    {stats.totalCourses}
                  </div>
                  <div className="text-xs text-gray-600 font-medium">Aktif Kurs</div>
                </div>
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 text-center border border-white/30 shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300">
                  <div className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                    {stats.averageProgress}%
                  </div>
                  <div className="text-xs text-gray-600 font-medium">Ortalama İlerleme</div>
                </div>
                {lastWatchedCourse ? (
                  <Link
                    href={`/courses/${lastWatchedCourse.slug}/learn?lesson=${lastWatchedCourse.lastLessonId}&section=${lastWatchedCourse.lastSectionId}&position=${lastWatchedCourse.lastPosition}`}
                    className="bg-gradient-to-r from-emerald-500 to-green-500 rounded-2xl p-4 text-center border border-emerald-400/30 shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 cursor-pointer group"
                  >
                    <div className="text-2xl mb-2 group-hover:scale-110 transition-transform duration-300">🚀</div>
                    <div className="text-sm text-white font-medium">Çalışmaya Devam Et!</div>
                    <div className="text-xs text-emerald-100 mt-1 opacity-80">{lastWatchedCourse.title}</div>
                  </Link>
                ) : (
                  <Link
                    href="/courses"
                    className="bg-gradient-to-r from-emerald-500 to-green-500 rounded-2xl p-4 text-center border border-emerald-400/30 shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 cursor-pointer group"
                  >
                    <div className="text-2xl mb-2 group-hover:scale-110 transition-transform duration-300">🚀</div>
                    <div className="text-sm text-white font-medium">Çalışmaya Devam Et!</div>
                    <div className="text-xs text-emerald-100 mt-1 opacity-80">Kurs keşfet</div>
                  </Link>
                )}
              </div>
            </div>
          </div>



          {/* Tab Navigation */}
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 overflow-hidden">
            <div className="bg-gradient-to-r from-gray-50 via-blue-50/50 to-indigo-50/50 border-b border-gray-200">
              <nav className="flex space-x-1 px-8 overflow-x-auto">
                {[
                  { id: "overview", label: "Genel Bakış", icon: "📊" },
                  { id: "courses", label: "Kurslarım", icon: "📚" },
                  { id: "orders", label: "Siparişlerim", icon: "📦" },
                  { id: "devices", label: "Cihazlarım", icon: "📱" },
                  { id: "profile", label: "Profil", icon: "👤" },
                  { id: "settings", label: "Ayarlar", icon: "⚙️" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-4 px-6 border-b-3 font-semibold text-sm transition-all duration-300 rounded-t-2xl whitespace-nowrap ${
                      activeTab === tab.id
                        ? "border-blue-500 text-blue-700 bg-white shadow-lg transform -translate-y-1"
                        : "border-transparent text-gray-700 hover:text-blue-700 hover:bg-white/70 hover:shadow-md"
                    }`}
                  >
                    <span className="text-lg mr-2">{tab.icon}</span>
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>

            {/* Tab Content */}
            <div className="p-8">
              {activeTab === "overview" && (
                <div className="space-y-8">
                  {/* Animated Welcome Section */}
                  <div className="text-center py-12 bg-gradient-to-br from-blue-50/50 via-indigo-50/30 to-purple-50/50 rounded-3xl border border-blue-200/50 overflow-hidden relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-indigo-500/5 to-purple-500/5"></div>
                    <div className="absolute top-0 left-1/4 w-32 h-32 bg-blue-400/20 rounded-full blur-2xl animate-pulse"></div>
                    <div className="absolute bottom-0 right-1/4 w-24 h-24 bg-purple-400/20 rounded-full blur-2xl animate-pulse" style={{animationDelay: '1.5s'}}></div>
                    
                    <div className="relative">
                      <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4 animate-fade-in">
                        Hoş Geldin, {user.firstName}! 👋
                      </h2>
                      <p className="text-xl text-gray-600 mb-6 max-w-2xl mx-auto">
                        Öğrenme yolculuğunda {stats.totalCourses} aktif kursın var ve ortalama {stats.averageProgress}% ilerleme kaydettin.
                      </p>
                      
                      <div className="inline-flex items-center space-x-6 bg-white/80 backdrop-blur-sm rounded-2xl px-6 py-4 border border-white/50 shadow-lg">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-600">{stats.totalCourses}</div>
                          <div className="text-sm text-gray-600">Aktif Kurs</div>
                        </div>
                        <div className="w-px h-12 bg-gray-300"></div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-600">{stats.completedLessons}</div>
                          <div className="text-sm text-gray-600">Tamamlanan Ders</div>
                        </div>
                        <div className="w-px h-12 bg-gray-300"></div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-purple-600">{stats.averageProgress}%</div>
                          <div className="text-sm text-gray-600">Ortalama İlerleme</div>
                        </div>
                      </div>
                    </div>
                  </div>



                  {/* Recent Courses */}
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                      <span className="mr-3">📊</span>
                      Son Kurslarım
                    </h3>
                    {recentCourses.length > 0 ? (
                      <div className="space-y-4">
                        {recentCourses.slice(0, 3).map((course, index) => (
                          <div 
                            key={course.id} 
                            className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg hover:border-blue-200 transition-all duration-300 overflow-hidden relative group animate-fade-in"
                            style={{ animationDelay: `${index * 0.2}s` }}
                          >
                            {/* Animated Background */}

                            

                            
                            <div className="relative">
                              <div className="flex items-center justify-between mb-4">
                                <div className="flex-1">
                                  <h4 className="font-bold text-gray-900 mb-4 text-2xl group-hover:text-blue-600 transition-colors duration-300 relative">
                                    <span className="relative z-10 flex items-center">
                                      <span className="mr-3 text-2xl">🎯</span>
                                      {course.title}
                                    </span>
                                  </h4>
                                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-3 flex items-center space-x-3 transition-all duration-300 shadow-sm">
                                      <span className="text-blue-500 text-lg">📚</span>
                                      <div>
                                        <div className="font-bold text-blue-800 text-lg">
                                          {course.totalLessons > 0 ? course.totalLessons : 'N/A'}
                                        </div>
                                        <div className="text-blue-600 text-xs">Toplam Ders</div>
                                      </div>
                                    </div>
                                    <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-3 flex items-center space-x-3 transition-all duration-300 shadow-sm">
                                      <span className="text-green-500 text-lg">✅</span>
                                      <div>
                                        <div className="font-bold text-green-800 text-lg">
                                          {course.completedLessons || 0}
                                        </div>
                                        <div className="text-green-600 text-xs">Tamamlanan</div>
                                      </div>
                                    </div>
                                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-3 flex items-center space-x-3 transition-all duration-300 shadow-sm">
                                      <span className="text-purple-500 text-lg">⏱️</span>
                                      <div>
                                        <div className="font-bold text-purple-800 text-lg">
                                          {course.duration > 0 ? formatDurationShort(Math.floor(course.duration / 60)) : 'N/A'}
                                        </div>
                                        <div className="text-purple-600 text-xs">Dakika</div>
                                      </div>
                                    </div>
                                  </div>
                                </div>

                              </div>

                                                              <div className="relative mb-6">
                                  <div className="flex items-center justify-between text-sm mb-3">
                                    <span className="text-gray-700 font-semibold flex items-center">
                                      <span className="mr-2">📊</span>
                                      İlerleme Durumu
                                    </span>
                                    <span className="text-blue-600 font-bold text-lg">{course.progress || 0}%</span>
                                  </div>
                                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                                  <div
                                    className={`h-3 rounded-full transition-all duration-500 ${
                                      (course.progress || 0) === 100 
                                        ? 'bg-green-500' 
                                        : (course.progress || 0) > 50
                                          ? 'bg-blue-500'
                                          : 'bg-orange-500'
                                    }`}
                                    style={{ width: `${course.progress || 0}%` }}
                                  >
                                    <div className="absolute right-0 top-0 w-3 h-3 bg-white rounded-full shadow transform translate-x-1/2 -translate-y-1/2"></div>
                                  </div>
                                </div>
                                <div className="flex justify-between text-xs text-gray-500 mt-2">
                                  <span className="bg-gray-100 px-2 py-1 rounded-full">0%</span>
                                  <span className="bg-gray-100 px-2 py-1 rounded-full">50%</span>
                                  <span className="bg-gray-100 px-2 py-1 rounded-full">100%</span>
                                </div>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                                <div className="bg-gray-50 rounded-xl px-4 py-2 flex items-center">
                                  <span className="mr-2 text-lg">🕒</span>
                                  <div>
                                    <div className="text-xs text-gray-500">Son Erişim</div>
                                    <div className="text-sm font-medium text-gray-700">
                                      {course.lastAccessed || 'Bilinmiyor'}
                                    </div>
                                  </div>
                                </div>
                                
                                {course.expiresAt && (
                                  <div className="bg-orange-50 rounded-xl px-4 py-2 flex items-center border border-orange-200">
                                    <span className="mr-2 text-lg">⏰</span>
                                    <div>
                                      <div className="text-xs text-orange-600">Bitiş Tarihi</div>
                                      <div className="text-sm font-medium text-orange-700">
                                        {new Date(course.expiresAt).toLocaleDateString("tr-TR", {
                                          year: 'numeric',
                                          month: 'short',
                                          day: 'numeric'
                                        })}
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>

                              <div className="flex space-x-3">
                                <Link
                                  href={`/courses/${course.slug}`}
                                  className="flex-1 px-5 py-3 bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-600 text-white text-sm rounded-xl hover:from-blue-600 hover:via-indigo-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl font-bold text-center"
                                >
                                  <span className="flex items-center justify-center">
                                    <span className="mr-2 text-lg">📖</span>
                                    Kurs Detayları
                                  </span>
                                </Link>
                                <Link
                                  href={`/courses/${course.slug}/learn`}
                                  className="flex-1 px-6 py-4 bg-gradient-to-r from-emerald-500 via-green-500 to-emerald-600 text-white text-base rounded-2xl hover:from-emerald-600 hover:via-green-600 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl font-bold text-center"
                                >
                                  <span className="flex items-center justify-center">
                                    <span className="mr-3 text-2xl">🚀</span>
                                    <span className="text-lg">Kursa Devam Et!</span>
                                  </span>
                                </Link>
                              </div>
                            </div>
                          </div>
                        ))}
                        
                        {recentCourses.length > 3 && (
                          <div className="text-center pt-4">
                            <Link
                              href="/profile?tab=courses"
                              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white font-medium rounded-xl hover:from-gray-700 hover:to-gray-800 transition-all duration-200"
                            >
                              <span className="mr-2">📋</span>
                              Tüm Kursları Gör ({recentCourses.length})
                            </Link>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-16 bg-gradient-to-br from-gray-50 to-blue-50/30 rounded-2xl border border-gray-200">
                        <div className="text-8xl mb-6">📚</div>
                        <h3 className="text-2xl font-bold text-gray-800 mb-3">Henüz Hiç Kursa Kayıt Olmadınız</h3>
                        <p className="text-gray-600 mb-6 text-lg">Öğrenmeye başlamak için kurslara göz atın!</p>
                        <Link
                          href="/courses"
                          className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                        >
                          <span className="mr-2">🚀</span>
                          Kursları Keşfet
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === "courses" && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold text-gray-800">Kurslarım</h3>
                    <div className="flex items-center space-x-4">
                      <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-2">
                        <span className="text-blue-800 font-medium">{stats.totalCourses} Aktif Kurs</span>
                      </div>
                      <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-2">
                        <span className="text-green-800 font-medium">{stats.averageProgress}% Ortalama İlerleme</span>
                      </div>
                    </div>
                  </div>

                  {recentCourses.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {recentCourses.map((course) => (
                        <div key={course.id} className="group bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-xl hover:border-blue-300 transition-all duration-300 overflow-hidden relative">
                          {/* Progress Badge */}
                          <div className="absolute top-4 right-4">
                            <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                              course.progress === 100 
                                ? 'bg-green-100 text-green-800' 
                                : course.progress > 50 
                                  ? 'bg-blue-100 text-blue-800' 
                                  : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {course.progress === 100 ? '✅ Tamamlandı' : `${course.progress}%`}
                            </div>
                          </div>

                          {/* Course Header */}
                          <div className="mb-4">
                            <h4 className="font-bold text-gray-900 text-lg mb-2 group-hover:text-blue-600 transition-colors">
                              {course.title}
                            </h4>
                            <div className="flex items-center space-x-4 text-sm text-gray-600">
                              <span className="flex items-center">
                                <span className="text-blue-500 mr-1">📚</span>
                                {course.totalLessons} ders
                              </span>
                              <span className="flex items-center">
                                <span className="text-green-500 mr-1">✅</span>
                                {course.completedLessons} tamamlandı
                              </span>
                            </div>
                          </div>

                          {/* Progress Bar */}
                          <div className="mb-4">
                            <div className="flex items-center justify-between text-sm mb-2">
                              <span className="text-gray-600">İlerleme</span>
                              <span className="font-medium text-blue-600">{course.progress}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                              <div
                                className={`h-3 rounded-full transition-all duration-1000 ${
                                  course.progress === 100 
                                    ? 'bg-gradient-to-r from-green-500 to-emerald-500' 
                                    : 'bg-gradient-to-r from-blue-500 to-indigo-500'
                                }`}
                                style={{ width: `${course.progress}%` }}
                              >
                                <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                              </div>
                            </div>
                          </div>

                          {/* Course Stats */}
                          <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                            <div className="bg-gray-50 rounded-xl p-3">
                              <div className="text-gray-600 mb-1">⏱️ Toplam Süre</div>
                              <div className="font-semibold text-gray-900">{course.totalDuration || 0} dakika</div>
                            </div>
                            <div className="bg-gray-50 rounded-xl p-3">
                              <div className="text-gray-600 mb-1">📅 Kalan Süre</div>
                              <div className="font-semibold text-gray-900">
                                {course.remainingTime ? Math.ceil(course.remainingTime / (1000 * 60 * 60 * 24)) : "∞"} gün
                              </div>
                            </div>
                          </div>

                          {/* Last Access */}
                          <div className="text-xs text-gray-500 mb-4 text-center">
                            Son erişim: {course.lastAccessed}
                          </div>

                          {/* Action Buttons */}
                          <div className="flex space-x-2">
                            <Link
                              href={`/courses/${course.slug}`}
                              className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-center py-3 px-4 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 text-sm font-medium shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                            >
                              📖 Kursa Git
                            </Link>
                            <Link
                              href={`/courses/${course.slug}/learn`}
                              className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white text-center py-3 px-4 rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-200 text-sm font-medium shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                            >
                              ▶️ Öğrenmeye Başla
                            </Link>
                          </div>

                          {/* Expiry Warning */}
                          {course.expiresAt && course.remainingTime && course.remainingTime < 7 * 24 * 60 * 60 * 1000 && (
                            <div className="mt-4 bg-red-50 border border-red-200 rounded-xl p-3">
                              <div className="flex items-center text-red-800 text-sm">
                                <span className="mr-2">⚠️</span>
                                <span className="font-medium">
                                  {Math.ceil(course.remainingTime / (1000 * 60 * 60 * 24))} gün kaldı!
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-16 bg-gradient-to-br from-gray-50 to-blue-50/30 rounded-2xl border border-gray-200">
                      <div className="text-8xl mb-6">📚</div>
                      <h3 className="text-2xl font-bold text-gray-800 mb-3">Henüz Hiç Kursa Kayıt Olmadınız</h3>
                      <p className="text-gray-600 mb-6 text-lg">Öğrenmeye başlamak için kurslara göz atın!</p>
                      <Link
                        href="/courses"
                        className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                      >
                        <span className="mr-2">🚀</span>
                        Kursları Keşfet
                      </Link>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "orders" && (
                <div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-6">Siparişlerim</h3>
                  {userOrders.length > 0 ? (
                    <div className="space-y-4">
                      {userOrders.map((order) => (
                        <div key={order.id} className="bg-white border border-gray-200 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <p className="font-medium text-gray-900">Sipariş #{order.orderNumber}</p>
                              <p className="text-sm text-gray-600">{new Date(order.purchasedAt).toLocaleDateString("tr-TR")}</p>
                            </div>
                            <span className={`px-3 py-1 text-sm rounded-full ${
                              order.status === "completed" ? "bg-green-100 text-green-800" : 
                              order.status === "pending" ? "bg-yellow-100 text-yellow-800" : 
                              "bg-gray-100 text-gray-800"
                            }`}>
                              {order.status === "completed" ? "Tamamlandı" : 
                               order.status === "pending" ? "Beklemede" : order.status}
                            </span>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="text-gray-700">Kurs: <span className="font-medium">{order.courseTitle}</span></p>
                              <p className="text-gray-700">Tutar: <span className="font-medium">{order.amount} {order.currency}</span></p>
                            </div>
                            <div>
                              <p className="text-gray-700">Bitiş Tarihi: <span className="font-medium">
                                {order.expiresAt ? new Date(order.expiresAt).toLocaleDateString("tr-TR") : "Süresiz"}
                              </span></p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-600 mb-4">Henüz sipariş bulunmuyor.</p>
                      <Link href="/courses" className="text-blue-600 hover:underline">Kurslara Göz At</Link>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "devices" && (
                <div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-6">Cihazlarım</h3>
                  {userDevices.length > 0 ? (
                    <div className="space-y-4">
                      {userDevices.map((device, index) => (
                        <div key={device.id} className="bg-white border border-gray-200 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                </svg>
                              </div>
                              <div>
                                <h4 className="font-medium text-gray-900">{device.deviceName || "Bilinmeyen Cihaz"}</h4>
                                <p className="text-sm text-gray-600">{device.platform} • {device.model}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <span className={`px-3 py-1 text-sm rounded-full ${
                                index < 3 ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                              }`}>
                                {index < 3 ? "🚀 Otomatik Onaylı" : "⏳ Onay Bekliyor"}
                              </span>
                            </div>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <span className="text-gray-600 font-medium">OS:</span>
                                <span className="text-gray-800">{device.osVersion || "Bilinmiyor"}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600 font-medium">Browser:</span>
                                <span className="text-gray-800">{device.appVersion || "Bilinmiyor"}</span>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <span className="text-gray-600 font-medium">Son Giriş:</span>
                                <span className="text-gray-800">{new Date(device.lastSeenAt).toLocaleDateString("tr-TR")}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600 font-medium">IP:</span>
                                <span className="text-gray-800 font-mono">{device.lastIp || "Bilinmiyor"}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-600 mb-4">Henüz cihaz bilgisi bulunmuyor.</p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "profile" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-bold text-gray-800">Profil Bilgileri</h3>
                    <button
                      onClick={() => setIsEditing(!isEditing)}
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200"
                    >
                      {isEditing ? "İptal" : "Profili Düzenle"}
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                      { label: "Ad", value: user.firstName, type: "text" },
                      { label: "Soyad", value: user.lastName, type: "text" },
                      { label: "E-posta", value: user.email, type: "email" },
                      { label: "Telefon", value: user.phone || "", type: "tel" },
                      { label: "Website", value: user.website || "", type: "url" },
                      { label: "Üyelik Tarihi", value: new Date(user.createdAt).toLocaleDateString("tr-TR"), type: "text", disabled: true },
                    ].map((field, index) => (
                      <div key={index}>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">{field.label}</label>
                        <input
                          type={field.type}
                          value={field.value}
                          disabled={!isEditing || field.disabled}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 transition-all duration-200"
                        />
                      </div>
                    ))}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Hakkımda</label>
                      <textarea
                        value={user.bio || ""}
                        disabled={!isEditing}
                        rows={4}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 transition-all duration-200 resize-none"
                        placeholder="Kendiniz hakkında kısa bir açıklama yazın..."
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "settings" && (
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold text-gray-800">Hesap Ayarları</h3>
                  <div className="space-y-4">
                    <button
                      onClick={() => setShowPasswordModal(true)}
                      className="w-full text-left px-6 py-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all duration-200 group"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                            </svg>
                          </div>
                          <div>
                            <span className="text-gray-800 font-medium text-lg">Şifre Değiştir</span>
                            <p className="text-gray-600 text-sm">Hesap güvenliğiniz için şifrenizi güncelleyin</p>
                          </div>
                        </div>
                        <svg className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </button>

                    <button className="w-full text-left px-6 py-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all duration-200 group">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center group-hover:bg-green-200 transition-colors">
                            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                          </div>
                          <div>
                            <span className="text-gray-800 font-medium text-lg">E-posta Bildirimleri</span>
                            <p className="text-gray-600 text-sm">Bildirim tercihlerinizi yönetin</p>
                          </div>
                        </div>
                        <svg className="w-5 h-5 text-gray-400 group-hover:text-green-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </button>

                    <button className="w-full text-left px-6 py-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all duration-200 group">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center group-hover:bg-red-200 transition-colors">
                            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </div>
                          <div>
                            <span className="text-gray-800 font-medium text-lg">Hesabı Sil</span>
                            <p className="text-gray-600 text-sm">Hesabınızı kalıcı olarak silin</p>
                          </div>
                        </div>
                        <svg className="w-5 h-5 text-gray-400 group-hover:text-red-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Şifre Değiştirme Modal */}
          {showPasswordModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-2xl p-8 w-full max-w-md mx-4 shadow-2xl">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Şifre Değiştir</h3>
                  <p className="text-gray-600">Hesap güvenliğiniz için yeni şifrenizi belirleyin</p>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Mevcut Şifre</label>
                    <input
                      type="password"
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                      placeholder="Mevcut şifrenizi girin"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Yeni Şifre</label>
                    <input
                      type="password"
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                      placeholder="Yeni şifrenizi girin"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Yeni Şifre Tekrar</label>
                    <input
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                      placeholder="Yeni şifrenizi tekrar girin"
                    />
                  </div>
                </div>

                <div className="flex space-x-3 mt-8">
                  <button
                    onClick={() => {
                      setShowPasswordModal(false)
                      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" })
                    }}
                    className="flex-1 bg-gray-100 text-gray-700 px-6 py-3 rounded-xl hover:bg-gray-200 transition-all duration-200 font-medium"
                  >
                    İptal
                  </button>
                  <button
                    onClick={() => {
                      // Şifre değiştirme API çağrısı burada yapılacak
                      console.log("Şifre değiştiriliyor:", passwordData)
                      setShowPasswordModal(false)
                      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" })
                    }}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 font-medium"
                  >
                    Şifreyi Değiştir
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </ProtectedRoute>
  )
}
