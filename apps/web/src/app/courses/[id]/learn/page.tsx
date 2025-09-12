"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { use } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { formatDurationMMSS } from "@/utils/duration";
import { 
  PlayIcon, 
  PauseIcon, 
  SpeakerWaveIcon, 
  SpeakerXMarkIcon,
  ClockIcon,
  BookOpenIcon,
  ChatBubbleLeftRightIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  PlayCircleIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  PlusIcon,

  ArrowLeftIcon
} from "@heroicons/react/24/outline";

interface CourseData {
  id: string;
  title: string;
  description: string;
  thumbnail?: string;
  instructor: {
    name: string;
    bio?: string;
    avatar?: string;
  };
  sections: Section[];
}

interface Section {
  id: string;
  title: string;
  description?: string;
  order: number;
  duration: number;
  totalLessons: number;
  isPublished: boolean;
  lessons: Lesson[];
}

interface Lesson {
  id: string;
  title: string;
  description?: string;
  duration: number;
  order: number;
  isPublished: boolean;
  videoUrl?: string;
  secureVideoUrl?: string;
  thumbnail?: string;
  videoType: 'VIDEO' | 'LIVE' | 'QUIZ' | 'ASSIGNMENT';
  isFree: boolean;

  progress?: number;
}

interface Note {
  id: string;
  content: string;
  timestamp: number; // Video saniyesi
  lessonId: string; // Hangi derse ait olduğu
  userId: string;
  userName: string;
  userRole: string;
  createdAt: string;
  isPublic: boolean;
}

interface Question {
  id: string;
  question: string;
  answer: string | null;
  userId: string;
  userName: string;
  userRole: string;
  answeredBy?: string;
  answeredByRole?: string;
  createdAt: string;
  upvotes: number;
  downvotes: number;
  isPublic: boolean;
}

export default function CourseLearnPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { user, isAuthenticated, token } = useAuth();
  
  const [courseData, setCourseData] = useState<CourseData | null>(null);
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [currentSection, setCurrentSection] = useState<Section | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Video states
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showControls, setShowControls] = useState(false);
  
  // Video player enhancements
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  
  // Progress tracking - Lesson specific
  const [lessonProgress, setLessonProgress] = useState(0);
  const [courseProgress, setCourseProgress] = useState(0);
  const [lastPosition, setLastPosition] = useState(0);
  
  // Lesson-specific progress tracking
  const [lessonProgressMap, setLessonProgressMap] = useState<Map<string, {
    progress: number;
    lastPosition: number;
    duration: number;
    completed: boolean;
  }>>(new Map());
  
  // Current lesson progress tracking
  const [currentLessonProgress, setCurrentLessonProgress] = useState({
    progress: 0,
    lastPosition: 0,
    duration: 0,
    completed: false
  });


  // Note and Q&A states
  const [notes, setNotes] = useState<Note[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [newNote, setNewNote] = useState('');
  const [newQuestion, setNewQuestion] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVideoLoading, setIsVideoLoading] = useState(true);
  const [videoError, setVideoError] = useState<string | null>(null);
  const [currentVideoTime, setCurrentVideoTime] = useState(0);
  const [showCourseDetails, setShowCourseDetails] = useState(false);
  
  // UI states
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState<'notes' | 'questions'>('questions'); // Questions otomatik açık
  const [expandedTabs, setExpandedTabs] = useState<Set<string>>(new Set(['questions', 'notes'])); // Hem questions hem notes otomatik genişik
  
  // Fetch course data
  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        setLoading(true);
        
        // Use slug endpoint since params.id contains the slug
        const response = await fetch(`http://localhost:3001/courses/slug/${resolvedParams.id}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        setCourseData(data);
        
        // Check URL parameters for specific lesson and position
        const urlParams = new URLSearchParams(window.location.search);
        const lessonId = urlParams.get('lesson');
        const sectionId = urlParams.get('section');
        const position = urlParams.get('position');
        
        if (lessonId && sectionId) {
          // Find the specific section and lesson
          const targetSection = data.sections.find((s: Section) => s.id === sectionId);
          if (targetSection) {
            setCurrentSection(targetSection);
            setExpandedSections(new Set([targetSection.id]));
            
            const targetLesson = targetSection.lessons.find((l: Lesson) => l.id === lessonId);
            if (targetLesson) {
              setCurrentLesson(targetLesson);
              
              // Set last position if provided
              if (position) {
                setLastPosition(parseFloat(position));
              }
            }
          }
        } else {
        // Set first section and lesson as default
        if (data.sections && data.sections.length > 0) {
          const firstSection = data.sections[0];
          setCurrentSection(firstSection);
          
          if (firstSection.lessons && firstSection.lessons.length > 0) {
            const firstLesson = firstSection.lessons[0];
            setCurrentLesson(firstLesson);
            setExpandedSections(new Set([firstSection.id]));
            }
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Kurs verisi yüklenemedi');
      } finally {
        setLoading(false);
      }
    };

    if (resolvedParams.id) {
      fetchCourseData();
    }
  }, [resolvedParams.id]);

  // Check authentication
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  // Function to get secure video URL - wrapped in useCallback to prevent infinite loops
  const getSecureVideoUrl = useCallback(async () => {
    if (!currentLesson || !user || !token) return;
    
    // Skip video URL generation for PDF lessons
    if (currentLesson.contentType === 'PDF') {
      return;
    }
    
    try {
      
      // Use the new API video streaming endpoint to avoid CORS issues
      const response = await fetch(`http://localhost:3001/secure-video/lesson/${currentLesson.id}/video`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        
        if (data.success && data.data.secureUrl) {
          // Update lesson with secure video URL
          setCurrentLesson(prev => prev ? {
            ...prev,
            secureVideoUrl: data.data.secureUrl
          } : null);
          
          
          // Reset video loading state and reload video
          setIsVideoLoading(false);
          setVideoError(null);
          
          // Force video element to reload with new source
          if (videoRef.current) {
            videoRef.current.load();
          }
        } else {
          setVideoError('Video URL alınamadı');
          setIsVideoLoading(false);
        }
      } else {
        setVideoError(`Video yüklenemedi: ${response.status}`);
        setIsVideoLoading(false);
      }
    } catch (error) {
      setVideoError('Video yüklenirken hata oluştu');
      setIsVideoLoading(false);
    }
  }, [currentLesson?.id, user?.id, token]);

  // Get secure video URL when lesson changes - with proper dependencies
  useEffect(() => {
    if (currentLesson && user && token) {
      
      // Only set video loading for non-PDF lessons
      if (currentLesson.contentType !== 'PDF') {
        setIsVideoLoading(true);
        setVideoError(null);
      } else {
        setIsVideoLoading(false);
        setVideoError(null);
      }
      
      // Don't reset progress immediately - wait for video to load
      // setCurrentTime(0);      // ❌ Don't reset immediately
      // setProgress(0);         // ❌ Don't reset immediately
      // setDuration(0);         // ❌ Don't reset immediately
      
      // Don't force reload video - let it load naturally
      // if (videoRef.current) {
      //   videoRef.current.currentTime = 0;  // ❌ Don't reset position
      //   videoRef.current.pause();          // ❌ Don't pause
      //   videoRef.current.load();           // ❌ Don't force reload
      // }
      
      getSecureVideoUrl();
    }
  }, [currentLesson?.id, currentLesson?.contentType, user?.id, token, getSecureVideoUrl]);

  // Load progress data when lesson changes - FIXED: Added proper dependencies and prevent infinite loops
  useEffect(() => {
    if (currentLesson && user && token) {
      // Always load progress for the new lesson
      loadLessonProgress();
      loadCourseProgress();
      
      // Notları ve soruları her zaman yükle
      loadNotes();
      loadQuestions();
    }
  }, [currentLesson?.id, user?.id]); // Removed courseData dependency to prevent infinite loops

  // Load all lessons progress when course data is loaded - FIXED: Added dependency array
  useEffect(() => {
    if (courseData && user && token) {
      loadAllLessonsProgress();
    }
  }, [courseData?.id, user?.id]); // Only depend on IDs, not entire objects

  // Function to load lesson progress
  const loadLessonProgress = async () => {
    if (!user || !currentLesson || !token) return;
    
    try {
      
      // Double-check that we're still on the same lesson
      const lessonId = currentLesson.id;
      
      const response = await fetch(`http://localhost:3001/lesson-progress/lesson/${lessonId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        
        // Verify we're still on the same lesson
        if (currentLesson?.id !== lessonId) {
          return;
        }
        
        const progress = data.progress || 0;
        const lastPos = data.lastPosition || 0;
        const lessonDuration = data.duration || 0;
        const completed = data.completed || false;
        
        // Update lesson progress map
        setLessonProgressMap(prev => new Map(prev).set(lessonId, {
          progress,
          lastPosition: lastPos,
          duration: lessonDuration,
          completed
        }));
        
        // Update current lesson progress
        setCurrentLessonProgress({
          progress,
          lastPosition: lastPos,
          duration: lessonDuration,
          completed
        });
        
        // Update global states for backward compatibility
        setLessonProgress(progress);
        setLastPosition(lastPos);
        
        // DON'T set position here - let video events handle it
      }
    } catch (error) {
      setLessonProgress(0);
      setCurrentLessonProgress({
        progress: 0,
        lastPosition: 0,
        duration: 0,
        completed: false
      });
    }
  };

  // Function to load course progress
  const loadCourseProgress = async () => {
    if (!user || !courseData || !token) return;
    
    try {
      const response = await fetch(`http://localhost:3001/lesson-progress/course/${courseData.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setCourseProgress(data.overallProgress || 0);
      }
    } catch (error) {
      setCourseProgress(0);
    }
  };

  // Function to load notes for current lesson
  const loadNotes = async () => {
    if (!user || !currentLesson || !token) return;
    
    try {
      const response = await fetch(`http://localhost:3001/notes/lesson/${currentLesson.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setNotes(data);
      } else {
      }
    } catch (error) {
    }
  };

  // Function to load questions for current lesson
  const loadQuestions = async () => {
    if (!user || !currentLesson || !token) return;
    
    try {
      const response = await fetch(`http://localhost:3001/questions/lesson/${currentLesson.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setQuestions(data);
        
        // Debug: Check if state was updated
        setTimeout(() => {
        }, 100);
      } else {
        setQuestions([]);
      }
    } catch (error) {
      setQuestions([]);
    }
  };

  // Function to load all lessons progress for the course
  const loadAllLessonsProgress = async () => {
    if (!user || !courseData || !token) return;
    
    try {
      const response = await fetch(`http://localhost:3001/lesson-progress/course/${courseData.id}/lessons`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        
        // Update lessonProgressMap with all lessons progress
        if (data.lessons) {
          const newProgressMap = new Map();
          
          // Initialize with existing data
          setLessonProgressMap(prev => {
            data.lessons.forEach((lessonProgress: any) => {
              newProgressMap.set(lessonProgress.lessonId, {
                progress: lessonProgress.progress || 0,
                lastPosition: lessonProgress.lastPosition || 0,
                duration: lessonProgress.duration || 0,
                completed: lessonProgress.completed || false
              });
            });
            return newProgressMap;
          });
        }
      }
    } catch (error) {
    }
  };

  // Prevent video download attempts
  useEffect(() => {
    const preventDownload = (e: KeyboardEvent) => {
      // Prevent Ctrl+S, Ctrl+Shift+S, F12, Ctrl+U
      if (
        (e.ctrlKey && e.key === 's') ||
        (e.ctrlKey && e.shiftKey && e.key === 'S') ||
        e.key === 'F12' ||
        (e.ctrlKey && e.key === 'u')
      ) {
        e.preventDefault();
      }
    };

    const preventRightClick = (e: MouseEvent) => {
      if (e.button === 2) { // Right click
        e.preventDefault();
      }
    };

    // Prevent IDM and download managers
    const preventDownloadManagers = (e: Event) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'VIDEO' || target.closest('video')) {
        // Block common download manager events
        e.preventDefault();
        e.stopPropagation();
      }
    };

    // Block video element events that download managers use
    const videoElement = videoRef.current;
    if (videoElement) {
      videoElement.addEventListener('loadstart', preventDownloadManagers);
      videoElement.addEventListener('canplay', preventDownloadManagers);
      videoElement.addEventListener('play', preventDownloadManagers);
      videoElement.addEventListener('pause', preventDownloadManagers);
      videoElement.addEventListener('seeking', preventDownloadManagers);
      videoElement.addEventListener('seeked', preventDownloadManagers);
      videoElement.addEventListener('ratechange', preventDownloadManagers);
      videoElement.addEventListener('volumechange', preventDownloadManagers);
    }

    document.addEventListener('keydown', preventDownload);
    document.addEventListener('contextmenu', preventRightClick);
    
    // Block drag and drop
    document.addEventListener('dragstart', preventDownloadManagers);
    document.addEventListener('drop', preventDownloadManagers);

    return () => {
      document.removeEventListener('keydown', preventDownload);
      document.removeEventListener('contextmenu', preventRightClick);
      document.removeEventListener('dragstart', preventDownloadManagers);
      document.removeEventListener('drop', preventDownloadManagers);
      
      if (videoElement) {
        videoElement.removeEventListener('loadstart', preventDownloadManagers);
        videoElement.removeEventListener('canplay', preventDownloadManagers);
        videoElement.removeEventListener('play', preventDownloadManagers);
        videoElement.removeEventListener('pause', preventDownloadManagers);
        videoElement.removeEventListener('seeking', preventDownloadManagers);
        videoElement.removeEventListener('seeked', preventDownloadManagers);
        videoElement.removeEventListener('ratechange', preventDownloadManagers);
        videoElement.removeEventListener('volumechange', preventDownloadManagers);
      }
    };
  }, []);

  // Set video position when lastPosition changes (from URL params)
  useEffect(() => {
    if (lastPosition > 0 && videoRef.current && currentLesson) {
      const video = videoRef.current;
      if (video.readyState >= 2) { // HAVE_CURRENT_DATA
        video.currentTime = lastPosition;
        setCurrentTime(lastPosition);
        setCurrentVideoTime(lastPosition);
      }
    }
  }, [lastPosition, currentLesson]);

  // Auto-save progress every 30 seconds
  useEffect(() => {
    if (!user || !currentLesson || currentTime === 0) return;

    const progressInterval = setInterval(() => {
      const progressPercent = Math.round((currentTime / duration) * 100);
      if (progressPercent > 0 && progressPercent <= 100) {
        saveProgress(progressPercent);
      }
    }, 30000); // Save every 30 seconds

    return () => clearInterval(progressInterval);
  }, [user, currentLesson, currentTime, duration]);

  // Mark lesson as completed when video reaches 95% (more realistic)
  useEffect(() => {
    if (currentTime > 0 && duration > 0) {
      const progressPercent = (currentTime / duration) * 100;
      // Only mark as completed if user has watched at least 95% AND has been watching for a reasonable time
      if (progressPercent >= 95 && lessonProgress < 100 && currentTime >= (duration * 0.8)) {
        markLessonCompleted();
      }
    }
  }, [currentTime, duration, lessonProgress]);



  const handleTimeUpdate = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    const video = e.currentTarget;
    const currentTime = video.currentTime;
    const duration = video.duration;
    
    setCurrentTime(currentTime);
    setCurrentVideoTime(currentTime);
    
    if (duration > 0) {
      const progressPercent = (currentTime / duration) * 100;
      setProgress(progressPercent);
      setDuration(duration);
      
      // Her 2 saniyede bir ilerleme kaydet (daha responsive)
      if (Math.floor(currentTime) % 2 === 0) {
        // İlerlemeyi tam sayı yap (1.29% -> 1%, 1.34% -> 1%)
        const roundedProgress = Math.floor(progressPercent);
        
        // CRITICAL: Validate current lesson before saving progress
        if (!currentLesson) {
          return;
        }
        
        // Daha akıllı progress detection:
        // 1. Progress artışı varsa kaydet
        // 2. Minimum 2% artış olmalı (daha hassas)
        // 3. Video pozisyonu da kaydet (her 2 saniyede)
        const shouldSaveProgress = roundedProgress > lessonProgress && (roundedProgress - lessonProgress) >= 2;
        const shouldSavePosition = Math.abs(currentTime - (currentLessonProgress.lastPosition || 0)) >= 2;
        
        if (shouldSaveProgress || shouldSavePosition) {
          
          // Progress ve position'ı birlikte kaydet
          saveProgress(roundedProgress);
        }
      }
    }
  };

  const handleLoadedMetadata = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    const video = e.currentTarget;
    const duration = video.duration;
    
    setDuration(duration);
    setIsVideoLoading(false);
    setVideoError(null);
    
    
    // Get progress for current lesson from lessonProgressMap
    const currentLessonData = currentLesson ? lessonProgressMap.get(currentLesson.id) : null;
    const validLastPosition = currentLessonData?.lastPosition || 0;
    const validProgress = currentLessonData?.progress || 0;
    
    
    // Kaldığı yerden devam et - but only if we have a valid lastPosition for THIS lesson
    if (validLastPosition > 0 && validLastPosition < duration && video.currentTime !== validLastPosition && validProgress > 0) {
      video.currentTime = validLastPosition;
      setCurrentTime(validLastPosition);
      setCurrentVideoTime(validLastPosition);
      
      // Also restore progress if available
      const progressPercent = (validLastPosition / duration) * 100;
      setProgress(progressPercent);
    } else {
      
      // Start from beginning for new lesson
      video.currentTime = 0;
      setCurrentTime(0);
      setCurrentVideoTime(0);
      setProgress(0);
    }
    
    // Don't auto-play - let user control
  };

  const handleVideoError = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    const video = e.currentTarget;
    setIsVideoLoading(false);
    
    let errorMessage = 'Video yüklenirken hata oluştu';
    
    if (video.error) {
      switch (video.error.code) {
        case 1:
          errorMessage = 'Video yüklenemedi: Abort error';
          break;
        case 2:
          errorMessage = 'Video yüklenemedi: Network error';
          break;
        case 3:
          errorMessage = 'Video yüklenemedi: Decode error';
          break;
        case 4:
          errorMessage = 'Video yüklenemedi: Source not supported';
          break;
        default:
          errorMessage = `Video hatası: ${video.error.message}`;
      }
    }
    
    setVideoError(errorMessage);
  };

  const handleVideoLoadStart = () => {
    setIsVideoLoading(true);
    setVideoError(null);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (videoRef.current) {
      const seekTime = (parseFloat(e.target.value) / 100) * duration;
      videoRef.current.currentTime = seekTime;
      setProgress(parseFloat(e.target.value));
      setCurrentTime(seekTime);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      if (isMuted) {
        videoRef.current.volume = volume;
        setIsMuted(false);
      } else {
        videoRef.current.volume = 0;
        setIsMuted(true);
      }
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (videoRef.current) {
      const newVolume = parseFloat(e.target.value);
      videoRef.current.volume = newVolume;
      setVolume(newVolume);
      setIsMuted(newVolume === 0);
    }
  };

  // Progress tracking functions - Lesson specific
  const saveProgress = useCallback(async (progressPercent: number) => {
    if (!user || !currentLesson || !token) return;
    
    // Progress validation - more responsive (minimum 2% increase)
    const currentProgress = currentLessonProgress.progress;
    const progressDifference = progressPercent - currentProgress;
    
    // Save if progress increased by at least 2% OR reached completion OR position changed significantly
    const positionChanged = Math.abs(currentTime - (currentLessonProgress.lastPosition || 0)) >= 2;
    const shouldSave = progressPercent > currentProgress && progressDifference >= 2 || progressPercent >= 95 || positionChanged;
    
    if (!shouldSave) {
      return;
    }
    
    try {
      
      const response = await fetch(`http://localhost:3001/lesson-progress/lesson/${currentLesson.id}/update`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          progress: progressPercent,
          duration: duration,
          lastPosition: currentTime,
        }),
      });

      if (response.ok) {
        // Update lesson progress map
        setLessonProgressMap(prev => new Map(prev).set(currentLesson.id, {
          progress: progressPercent,
          lastPosition: currentTime,
          duration: duration,
          completed: progressPercent >= 95
        }));
        
        // Update current lesson progress
        setCurrentLessonProgress(prev => ({
          ...prev,
          progress: progressPercent,
          lastPosition: currentTime,
          duration: duration,
          completed: progressPercent >= 95
        }));
        
        // Update global states for backward compatibility
        setLessonProgress(progressPercent);
        setLastPosition(currentTime);
        
        
        // Kurs genel ilerlemesini güncelle
        if (courseData) {
          loadCourseProgress();
        }
      } else {
      }
    } catch (error) {
    }
  }, [user?.id, currentLesson?.id, token, duration, currentTime, currentLessonProgress.progress, currentLessonProgress.lastPosition]);

  // Function to mark lesson as completed
  const markLessonCompleted = useCallback(async () => {
    if (!user || !currentLesson || !token) return;
    
    // CRITICAL: Validate that we're marking completion for the correct lesson
    const lessonId = currentLesson.id;
    
    try {
      const response = await fetch(`http://localhost:3001/lesson-progress/lesson/${lessonId}/update`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          progress: 100,
          duration: duration,
          lastPosition: currentTime,
          completed: true,
        }),
      });

      if (response.ok) {
        setLessonProgress(100);
      }
    } catch (error) {
    }
  }, [user?.id, currentLesson?.id, token, duration, currentTime]);





  // Section and lesson functions
  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  // Tab toggle function
  const toggleTab = (tabName: 'notes' | 'questions') => {
    const newExpanded = new Set(expandedTabs);
    if (newExpanded.has(tabName)) {
      newExpanded.delete(tabName);
    } else {
      newExpanded.add(tabName);
    }
    setExpandedTabs(newExpanded);
  };

  const selectLesson = (lesson: Lesson, section: Section) => {
    setCurrentLesson(lesson);
    setCurrentSection(section);
    setCurrentTime(0);
    setProgress(0);
    setIsPlaying(false);
  };

  // Note functions
  const addNote = async () => {
    if (newNote.trim() && currentLesson && user && token) {
      try {

        const response = await fetch('http://localhost:3001/notes', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            lessonId: currentLesson.id,
        content: newNote,
        timestamp: currentVideoTime,
            isPublic: true
          }),
        });

        if (response.ok) {
          const savedNote = await response.json();
          
          // Notu listeye ekle
          setNotes([...notes, savedNote]);
      setNewNote('');
          
          // Notları yeniden yükle
          loadNotes();
        } else {
        }
      } catch (error) {
      }
    }
  };

  // Jump to timestamp in video
  const jumpToTimestamp = (timestamp: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = timestamp;
      setCurrentTime(timestamp);
      setCurrentVideoTime(timestamp);
      
      // Video oynatmayı başlat
      if (videoRef.current.paused) {
      videoRef.current.play();
      }
      
    }
  };

  // Delete note (only by creator)
  const deleteNote = async (noteId: string, noteUserId: string) => {
    if (user?.id === noteUserId && token) {
      try {
        const response = await fetch(`http://localhost:3001/notes/${noteId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
      setNotes(notes.filter(note => note.id !== noteId));
        } else {
        }
      } catch (error) {
      }
    }
  };

  // Add question function with file upload
  const addQuestion = async () => {
    if (newQuestion.trim() && currentLesson && user && token && courseData) {
      try {

        const formData = new FormData();
        formData.append('title', newQuestion);
        formData.append('content', newQuestion);
        formData.append('courseId', courseData.id);
        
        if (selectedFile) {
          formData.append('file', selectedFile);
        }

        const response = await fetch(`http://localhost:3001/questions/lesson/${currentLesson.id}`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            // Don't set Content-Type for FormData, let browser set it with boundary
          },
          body: formData,
        });

        if (response.ok) {
          const savedQuestion = await response.json();
          
          // Soruyu listeye ekle
          setQuestions([savedQuestion, ...questions]);
          setNewQuestion('');
          setSelectedFile(null);
          
          // Soruları yeniden yükle
          loadQuestions();
        } else {
        }
      } catch (error) {
      }
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}s ${mins}dk`;
    }
    return `${mins} dakika`;
  };

  // File handling functions
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        alert('Dosya boyutu 10MB\'dan büyük olamaz!');
        return;
      }
      
      // Check file type
      const allowedTypes = [
        'image/jpeg',
        'image/png',
        'image/gif',
        'image/webp',
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'text/plain',
      ];
      
      if (!allowedTypes.includes(file.type)) {
        alert('Desteklenmeyen dosya türü! Sadece resim, PDF, Word ve metin dosyaları kabul edilir.');
        return;
      }
      
      setSelectedFile(file);
    }
  };

  const removeSelectedFile = () => {
    setSelectedFile(null);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="bg-gray-200 rounded-lg h-96 mb-6"></div>
                <div className="space-y-4">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="h-6 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !courseData) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Hata</h1>
            <p className="text-gray-600 mb-6">{error || 'Kurs bulunamadı'}</p>
            <button
              onClick={() => router.back()}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Geri Dön
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Top Navigation Bar */}
      <div className="bg-gray-800 border-b border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.back()}
              className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
            >
              <ArrowLeftIcon className="w-5 h-5" />
              <span>Geri Dön</span>
            </button>
            <div className="w-px h-6 bg-gray-600"></div>
            
            {/* Breadcrumb */}
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <span>Kurslar</span>
              <span>/</span>
              <span className="text-white">{courseData.title}</span>
              {currentSection && (
                <>
                  <span>/</span>
                  <span className="text-blue-400">{currentSection.title}</span>
                </>
              )}
              {currentLesson && (
                <>
                  <span>/</span>
                  <span className="text-green-400">{currentLesson.title}</span>
                </>
              )}
            </div>
          </div>
          
          {/* Progress Section */}
          <div className="flex items-center space-x-6">
            {/* Course Progress */}
            <div className="text-center">
              <p className="text-sm text-gray-400">Kurs İlerlemesi</p>
              <div className="flex items-center space-x-2">
                <div className="w-16 h-2 bg-gray-600 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 rounded-full" style={{ width: `${courseProgress}%` }}></div>
                </div>
                <span className="text-lg font-semibold text-green-400">{Math.round(courseProgress)}%</span>
              </div>
            </div>
            
            {/* Current Lesson Progress */}
            <div className="text-center">
              <p className="text-sm text-gray-400">Bu Ders</p>
              <div className="flex items-center space-x-2">
                <div className="w-16 h-2 bg-gray-600 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: `${lessonProgress}%` }}></div>
                </div>
                <span className="text-lg font-semibold text-blue-400">{Math.round(lessonProgress)}%</span>
              </div>
            </div>
            
            {/* Time Remaining */}
            <div className="text-center">
              <p className="text-sm text-gray-400">Kalan Süre</p>
              <div className="flex items-center space-x-1">
                <ClockIcon className="w-4 h-4 text-yellow-400" />
                <span className="text-lg font-semibold text-yellow-400">
                  {duration > 0 ? formatTime(duration - currentTime) : '--:--'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex h-[calc(100vh-80px)]">
        {/* Video Player Section - Left Side */}
        <div className="flex-1 bg-black p-6">
          <div className="h-full flex flex-col">
            {/* Video Player */}
            <div className="flex-1 bg-black rounded-lg overflow-hidden relative group">
              {/* Loading State - Only show for non-PDF lessons */}
              {isVideoLoading && currentLesson?.contentType !== 'PDF' && (
                <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-10">
                  <div className="text-center text-white">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p>Video yükleniyor...</p>
                    <p className="text-sm text-gray-300 mt-2">
                      {currentLesson?.secureVideoUrl ? 'Güvenli video yükleniyor...' : 'Video hazırlanıyor...'}
                    </p>
                  </div>
                </div>
              )}

              {/* Error State */}
              {videoError && (
                <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-10">
                  <div className="text-center text-white">
                    <div className="text-red-500 text-6xl mb-4">❌</div>
                    <p className="text-red-400">{videoError}</p>
                    <div className="mt-4 space-y-2">
                      <button 
                        onClick={() => {
                          setVideoError(null);
                          setIsVideoLoading(true);
                          getSecureVideoUrl();
                        }} 
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg mr-2"
                      >
                        Tekrar Dene
                      </button>
                      <button 
                        onClick={() => window.location.reload()} 
                        className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg"
                      >
                        Sayfayı Yenile
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Content Display - Video or PDF */}
              {currentLesson?.contentType === 'PDF' ? (
                // PDF Viewer
                <div className="w-full h-full bg-gray-100 flex flex-col">
                  {/* PDF Header */}
                  <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <svg className="w-6 h-6 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                      </svg>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800">
                          {currentLesson.pdfFileName || 'PDF Dosyası'}
                        </h3>
                        <p className="text-sm text-gray-500">PDF Dersi</p>
                      </div>
                    </div>
                    <button
                      onClick={async () => {
                        try {
                          // Mark lesson as completed when PDF is viewed
                          if (currentLesson && user && token) {
                            saveProgress(100);
                            setLessonProgress(100);
                            
                            // Kurs genel ilerlemesini güncelle
                            if (courseData) {
                              loadCourseProgress();
                            }
                          }
                        } catch (error) {
                        }
                      }}
                      className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
                    >
                      ✅ Dersi Tamamla
                    </button>
                  </div>
                  
                  {/* PDF Content */}
                  <div className="flex-1 bg-gray-50 overflow-hidden">
                    <iframe
                      src="http://localhost:3001/uploads/pdfs/1757443755835-m6fl052r69l.pdf#zoom=75"
                      className="w-full h-full border-0 transform scale-75 origin-top-left"
                      style={{ width: '133.33%', height: '133.33%' }}
                      title="PDF Viewer"
                      onLoad={() => {
                        // Mark lesson as completed when PDF loads
                        if (currentLesson && user && token) {
                          saveProgress(100);
                          setLessonProgress(100);
                          
                          // Kurs genel ilerlemesini güncelle
                          if (courseData) {
                            loadCourseProgress();
                          }
                        }
                      }}
                    />
                  </div>
                </div>
              ) : (
                // Video Player
                <video
                  key={currentLesson?.id || 'no-lesson'}
                  ref={videoRef}
                  src={currentLesson?.secureVideoUrl || currentLesson?.videoUrl || ''}
                  className="w-full h-full object-cover"
                  onTimeUpdate={handleTimeUpdate}
                  onLoadedMetadata={handleLoadedMetadata}
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                  onVolumeChange={(e) => setVolume(e.currentTarget.volume)}
                  onSeeked={() => {
                    if (videoRef.current) {
                      const progressPercent = Math.round((videoRef.current.currentTime / videoRef.current.duration) * 100);
                      setProgress(progressPercent);
                      saveProgress(progressPercent);
                    }
                  }}
                  onContextMenu={(e) => e.preventDefault()}
                  onDragStart={(e) => e.preventDefault()}
                  onDrop={(e) => e.preventDefault()}
                  onLoadStart={handleVideoLoadStart}
                  onCanPlay={() => {
                    setIsVideoLoading(false);
                  }}
                  onSeeking={(e) => e.preventDefault()}
                  onRateChange={(e) => e.preventDefault()}
                  onError={handleVideoError}
                  onLoadedData={() => {
                    setIsVideoLoading(false);
                  }}
                  onCanPlayThrough={() => {
                    setIsVideoLoading(false);
                    
                    // Get progress for current lesson from lessonProgressMap
                    const currentLessonData = currentLesson ? lessonProgressMap.get(currentLesson.id) : null;
                    const validLastPosition = currentLessonData?.lastPosition || 0;
                    const validProgress = currentLessonData?.progress || 0;
                    
                    // Video oynatılmaya hazır olduğunda kaldığı yerden başlat - but only for THIS lesson
                    if (validLastPosition > 0 && videoRef.current && videoRef.current.currentTime !== validLastPosition && validProgress > 0) {
                      // Check if lastPosition is valid
                      if (validLastPosition < videoRef.current.duration) {
                        videoRef.current.currentTime = validLastPosition;
                        setCurrentTime(validLastPosition);
                        setCurrentVideoTime(validLastPosition);
                        
                        // Restore progress
                        const progressPercent = (validLastPosition / videoRef.current.duration) * 100;
                        setProgress(progressPercent);
                      } else {
                        
                        // Start from beginning
                        videoRef.current.currentTime = 0;
                        setCurrentTime(0);
                        setCurrentVideoTime(0);
                        setProgress(0);
                      }
                    } else {
                      
                      // Start from beginning for new lesson
                      if (videoRef.current) {
                        videoRef.current.currentTime = 0;
                        setCurrentTime(0);
                        setCurrentVideoTime(0);
                        setProgress(0);
                      }
                    }
                  }}
                  onEnded={() => {
                    // Video bittiğinde otomatik tamamla
                    if (currentLesson && user && token) {
                      saveProgress(100);
                      setLessonProgress(100);
                      
                      // Kurs genel ilerlemesini güncelle
                      if (courseData) {
                        loadCourseProgress();
                      }
                    }
                  }}
                  controlsList="nodownload nofullscreen noremoteplayback"
                  disablePictureInPicture
                  disableRemotePlayback
                  preload="metadata"
                  crossOrigin="anonymous"
                  playsInline
                >
                  Tarayıcınız video oynatmayı desteklemiyor.
                </video>
              )}

              {/* Unified Video Control Panel - Only show for video lessons */}
              {currentLesson?.contentType !== 'PDF' && (
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
                {/* Top Bar - Video Info */}
                <div className="absolute top-4 left-4 right-4">
                  <div className="flex items-center justify-between">
                    <div className="text-white">
                      <h3 className="font-semibold text-lg">{currentLesson?.title}</h3>
                      <p className="text-sm text-gray-300 opacity-80">
                        {Math.floor(currentVideoTime / 60)}:{(currentVideoTime % 60).toFixed(0).padStart(2, '0')} / {duration > 0 ? formatTime(duration) : '--:--'}
                      </p>
                    </div>
                    
                    {/* Quick Actions */}
                    <div className="flex items-center space-x-3">

                      
                      {/* Fullscreen Button */}
                      <button
                        onClick={() => {
                          if (videoRef.current) {
                            if (document.fullscreenElement) {
                              document.exitFullscreen();
                            } else {
                              videoRef.current.requestFullscreen();
                            }
                          }
                        }}
                        className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                      >
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Center - Play/Pause Button */}
                <div className="absolute inset-0 flex items-center justify-center">
                      <button
                        onClick={() => {
                          if (videoRef.current) {
                            videoRef.current.paused ? videoRef.current.play() : videoRef.current.pause();
                          }
                        }}
                    className="w-20 h-20 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110"
                  >
                    {videoRef.current?.paused ? (
                      <svg className="w-10 h-10 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z"/>
                      </svg>
                    ) : (
                      <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
                      </svg>
                    )}
                      </button>
                    </div>
                    
                {/* Bottom Bar - Progress & Controls */}
                <div className="absolute bottom-4 left-4 right-4">
                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex items-center space-x-3">
                      <span className="text-sm text-white font-mono">
                        {Math.floor(currentVideoTime / 60)}:{(currentVideoTime % 60).toFixed(0).padStart(2, '0')}
                      </span>
                      <div className="flex-1 relative">
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={duration > 0 ? (currentVideoTime / duration) * 100 : 0}
                          onChange={(e) => {
                            if (videoRef.current && duration > 0) {
                              const seekTime = (parseFloat(e.target.value) / 100) * duration;
                              videoRef.current.currentTime = seekTime;
                            }
                          }}
                          className="w-full h-2 video-slider"
                          style={{
                            background: `linear-gradient(to right, #3B82F6 0%, #3B82F6 ${duration > 0 ? (currentVideoTime / duration) * 100 : 0}%, rgba(255,255,255,0.3) ${duration > 0 ? (currentVideoTime / duration) * 100 : 0}%)`
                          }}
                        />
                      </div>
                      <span className="text-sm text-white font-mono">
                        {duration > 0 ? formatTime(duration) : '--:--'}
                      </span>
                    </div>
                  </div>

                  {/* Control Buttons */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {/* Volume Control */}
                      <div className="flex items-center space-x-2">
                    <button
                          onClick={toggleMute}
                          className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                        >
                          {isMuted ? (
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" clipRule="evenodd" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                            </svg>
                          ) : (
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                            </svg>
                          )}
                        </button>
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.1"
                          value={volume}
                          onChange={handleVolumeChange}
                          className="w-20 h-2 video-slider"
                        />
                      </div>

                      {/* Playback Speed */}
                      <div className="relative">
                        <button
                          onClick={() => setShowSpeedMenu(!showSpeedMenu)}
                          className="px-3 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm transition-colors text-white"
                        >
                          {playbackSpeed}x
                        </button>
                        {showSpeedMenu && (
                          <div className="absolute bottom-full right-0 mb-2 bg-gray-800 rounded-lg shadow-lg z-10 min-w-[120px]">
                            {[0.5, 0.75, 1, 1.25, 1.5, 2].map((speed) => (
                              <button
                                key={speed}
                      onClick={() => {
                                  if (videoRef.current) {
                                    videoRef.current.playbackRate = speed;
                                    setPlaybackSpeed(speed);
                                  }
                                  setShowSpeedMenu(false);
                                }}
                                className={`w-full px-4 py-2 text-left hover:bg-gray-700 transition-colors ${
                                  playbackSpeed === speed ? 'bg-blue-600 text-white' : 'text-gray-300'
                                }`}
                              >
                                {speed}x
                    </button>
                            ))}
                  </div>
                        )}
                      </div>
                    </div>

                    {/* Right Side Controls */}
                    <div className="flex items-center space-x-3">
                      {/* Progress Save Indicator */}
                      <div className="text-xs text-white/70 bg-white/10 px-2 py-1 rounded">
                        {Math.round(lessonProgress)}% tamamlandı
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              )}
            </div>

            {/* Video Controls Summary - Lesson Specific - Only show for video lessons */}
            {currentLesson?.contentType !== 'PDF' && (
              <div className="mt-4 bg-gray-800 rounded-lg p-4">
              <div className="flex items-center justify-center space-x-6 text-sm text-gray-400">
                <div className="flex items-center space-x-2">
                  <span>🎯</span>
                  <span>Ders İlerlemesi: {Math.round(currentLessonProgress.progress)}%</span>
                  {currentLessonProgress.lastPosition > 0 && (
                    <span className="text-xs text-blue-400">
                      (Kaldığı yer: {formatTime(currentLessonProgress.lastPosition)})
                    </span>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <span>📚</span>
                  <span>Kurs Genel: {Math.round(courseProgress)}%</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span>⏱️</span>
                  <span>Süre: {duration > 0 ? formatTime(currentTime) : '--:--'} / {duration > 0 ? formatTime(duration) : '--:--'}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span>🔊</span>
                  <span>Ses: {Math.round(volume * 100)}%</span>
                </div>
              </div>
              
              {/* Lesson Progress Bar */}
              <div className="mt-3">
                <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
                  <span>Ders İlerlemesi</span>
                  <span>{Math.round(currentLessonProgress.progress)}%</span>
            </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300" 
                    style={{ width: `${currentLessonProgress.progress}%` }}
                  ></div>
                </div>
                {currentLessonProgress.completed && (
                  <div className="text-center mt-2">
                    <span className="text-green-400 text-xs">✅ Ders Tamamlandı</span>
                  </div>
                )}
              </div>
              
              {/* Additional Progress Info */}
              <div className="mt-4 grid grid-cols-3 gap-4 text-center">
                <div className="bg-gray-700 rounded-lg p-3">
                  <div className="text-xs text-gray-400 mb-1">Kurs İlerlemesi</div>
                  <div className="text-lg font-bold text-blue-400">{Math.round(courseProgress)}%</div>
                </div>
                <div className="bg-gray-700 rounded-lg p-3">
                  <div className="text-xs text-gray-400 mb-1">Bu Ders</div>
                  <div className="text-lg font-bold text-green-400">{Math.round(currentLessonProgress.progress)}%</div>
                </div>
                <div className="bg-gray-700 rounded-lg p-3">
                  <div className="text-xs text-gray-400 mb-1">Kalan Süre</div>
                  <div className="text-lg font-bold text-yellow-400">
                    {duration > 0 && currentTime > 0 ? formatTime(duration - currentTime) : '--:--'}
                  </div>
                </div>
              </div>
            </div>
            )}
          </div>
        </div>

        {/* Course Content Section - Right Side */}
        <div className="w-[450px] bg-gray-800 border-l border-gray-700 overflow-y-auto">
          <div className="p-6">
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-4 text-white">Ders İçeriği</h2>
              
              {/* Search Bar */}
              <div className="relative mb-4">
                <input
                  type="text"
                  placeholder="Ders ara..."
                  className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
                <BookOpenIcon className="absolute right-3 top-2.5 w-5 h-5 text-gray-400" />
              </div>
              
              {/* Filter Buttons */}
              <div className="flex space-x-2 mb-4">
                <button className="px-3 py-1 bg-blue-600 text-white text-xs rounded-full">Tümü</button>
                <button className="px-3 py-1 bg-gray-600 text-gray-300 text-xs rounded-full hover:bg-gray-500">Video</button>
                <button className="px-3 py-1 bg-gray-600 text-gray-300 text-xs rounded-full hover:bg-gray-500">Quiz</button>
                <button className="px-3 py-1 bg-gray-600 text-gray-300 text-xs rounded-full hover:bg-gray-500">Ödev</button>
              </div>
            </div>
            
            {/* Sections */}
            <div className="space-y-4">
              {courseData.sections?.map((section: Section) => (
                <div key={section.id} className="bg-gray-700 rounded-lg overflow-hidden">
                  <button
                    onClick={() => toggleSection(section.id)}
                    className="w-full px-4 py-3 text-left flex items-center justify-between hover:bg-gray-600 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <BookOpenIcon className="w-5 h-5 text-blue-400" />
                      <div>
                        <h3 className="font-medium text-white">{section.title}</h3>
                        <p className="text-sm text-gray-400">{section.lessons?.length || 0} ders</p>
                      </div>
                    </div>
                    {expandedSections.has(section.id) ? (
                      <ChevronDownIcon className="w-5 h-5 text-gray-400" />
                    ) : (
                      <ChevronRightIcon className="w-5 h-5 text-gray-400" />
                    )}
                  </button>
                  
                  {expandedSections.has(section.id) && (
                    <div className="border-t border-gray-600">
                      {section.lessons?.map((lesson: Lesson) => (
                        <button
                          key={lesson.id}
                          onClick={() => {
                            
                            // Get existing progress for this lesson
                            const existingProgress = lessonProgressMap.get(lesson.id);
                            if (existingProgress) {
                            }
                            
                            setCurrentLesson(lesson);
                            setCurrentSection(section);
                            
                            // Reset video states for new lesson
                            setIsVideoLoading(true);
                            setVideoError(null);
                            setCurrentTime(0);
                            setCurrentVideoTime(0);
                            setProgress(0);
                            setDuration(0);
                            
                            // Reset progress states for new lesson
                            setLessonProgress(0);
                            setLastPosition(0);
                            setCurrentLessonProgress({
                              progress: 0,
                              lastPosition: 0,
                              duration: 0,
                              completed: false
                            });
                            
                            // Reset video element
                            if (videoRef.current) {
                              videoRef.current.currentTime = 0;
                              videoRef.current.pause();
                              videoRef.current.load();
                            }
                            
                            // Load progress for the new lesson immediately
                            loadLessonProgress();
                          }}
                          className={`w-full px-6 py-3 text-left flex items-center space-x-3 hover:bg-gray-600 transition-colors ${
                            currentLesson?.id === lesson.id ? 'bg-blue-600 text-white' : 'text-gray-300'
                          }`}
                        >
                          <div className="relative">
                            <PlayCircleIcon className="w-4 h-4" />
                            {/* Completion Status - Dynamic based on progress */}
                            {(() => {
                              const progressData = lessonProgressMap.get(lesson.id);
                              if (progressData && (progressData.completed || progressData.progress >= 95)) {
                                return (
                                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-800 flex items-center justify-center">
                                    <span className="text-xs text-white">✓</span>
                                  </div>
                                );
                              } else if (progressData && progressData.progress > 0) {
                                return (
                                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full border-2 border-gray-800 flex items-center justify-center">
                                    <span className="text-xs text-white">{Math.round(progressData.progress)}</span>
                                  </div>
                                );
                              }
                              return null;
                            })()}
                          </div>
                          <div className="flex-1 text-left">
                            <div className="flex items-center space-x-2">
                              <p className="font-medium">{lesson.title}</p>
                              {lesson.contentType === 'PDF' && (
                                <span className="text-red-500 text-sm" title="PDF Dersi">📄</span>
                              )}
                            </div>
                            <div className="flex items-center space-x-2 mt-1">
                                <span className="text-sm opacity-75">
                                  {lesson.contentType === 'PDF' ? 'PDF' : formatDurationMMSS(lesson.duration || 0)}
                                </span>
                                
                                {/* Progress from lessonProgressMap */}
                                {(() => {
                                  const progressData = lessonProgressMap.get(lesson.id);
                                  if (progressData) {
                                    if (progressData.completed || progressData.progress >= 95) {
                                      return <span className="text-xs text-green-400">✓ Tamamlandı</span>;
                                    } else if (progressData.progress > 0) {
                                      return (
                                        <div className="flex items-center space-x-1">
                                          <span className="text-xs text-blue-400">{progressData.progress}%</span>
                                          {progressData.lastPosition > 0 && (
                                            <span className="text-xs text-gray-400">
                                              ({formatTime(progressData.lastPosition)})
                                            </span>
                                          )}
                                        </div>
                                      );
                                    }
                                  }
                                  return <span className="text-xs text-gray-400">Henüz başlanmadı</span>;
                                })()}
                            </div>
                          </div>
                          {lesson.isFree && (
                            <span className="text-xs bg-green-600 text-white px-2 py-1 rounded">Ücretsiz</span>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gray-800 border-t border-gray-700">
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Side - Notes Section */}
          <div className="bg-gray-700 rounded-2xl overflow-hidden">
            {/* Notes Header */}
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-white/20 rounded-full">
                    <DocumentTextIcon className="w-6 h-6 text-white" />
        </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white">Ders Notları</h3>
                    <p className="text-blue-100 text-sm">
                      {notes.filter((note) => note.lessonId === currentLesson?.id).length} not
                    </p>
        </div>
                </div>
              <button
                  onClick={() => toggleTab("notes")}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  {expandedTabs.has("notes") ? (
                    <ChevronDownIcon className="w-5 h-5 text-white" />
                  ) : (
                    <ChevronRightIcon className="w-5 h-5 text-white" />
                )}
              </button>
              </div>
            </div>

            {/* Notes Content */}
            {expandedTabs.has("notes") && (
              <div className="p-8 max-h-[80vh] overflow-y-auto">
                  <div className="space-y-4">
                  {notes.filter((note) => note.lessonId === currentLesson?.id).length === 0 ? (
                    <div className="text-center py-8 text-gray-400">
                      <div className="text-4xl mb-2">📝</div>
                      <p className="text-sm">Bu video için henüz not eklenmemiş</p>
                      <p className="text-xs mt-1">Video izlerken önemli noktaları not alabilirsiniz</p>
                    </div>
                  ) : (
                    notes
                      .filter((note) => note.lessonId === currentLesson?.id)
                      .map((note) => (
                        <div
                          key={note.id}
                          className="bg-gray-600 rounded-lg p-4 hover:bg-gray-500 transition-colors cursor-pointer"
                        >
                        <div className="flex items-center justify-between mb-3">
                          <button
                            onClick={() => jumpToTimestamp(note.timestamp)}
                              className="text-sm text-blue-400 hover:text-blue-300 bg-gray-700 px-3 py-1 rounded-full hover:bg-gray-600 transition-colors cursor-pointer flex items-center space-x-2 hover:bg-blue-600 hover:text-white"
                            >
                              <span>🎯</span>
                              <span>
                                {Math.floor(note.timestamp / 60)}:{(note.timestamp % 60).toFixed(0).padStart(2, "0")}
                              </span>
                              <span className="text-xs">→ Git</span>
                          </button>
                          <div className="flex items-center space-x-2">
                            <span className="text-xs text-gray-400 bg-gray-700 px-2 py-1 rounded">
                                {note.userRole === "ADMIN"
                                  ? "👑 Admin"
                                  : note.userRole === "INSTRUCTOR"
                                    ? "👨‍🏫 Eğitmen"
                                    : "👤 Öğrenci"}
                            </span>
                            {user?.id === note.userId && (
                              <button 
                                onClick={() => deleteNote(note.id, note.userId)}
                                className="text-red-400 hover:text-red-300 text-sm hover:bg-red-900/20 px-2 py-1 rounded transition-colors"
                              >
                                🗑️ Sil
                              </button>
                            )}
                          </div>
                        </div>
                        <p className="text-white text-sm leading-relaxed mb-2">{note.content}</p>
                        <div className="flex items-center justify-between text-xs text-gray-400">
                            <span className="flex items-center space-x-1">
                              <span>👤</span>
                          <span>{note.userName}</span>
                            </span>
                            <span className="flex items-center space-x-1">
                              <span>📅</span>
                              <span>{new Date(note.createdAt).toLocaleDateString("tr-TR")}</span>
                            </span>
                        </div>
                      </div>
                      ))
                  )}

                  <div className="bg-gray-600 rounded-lg p-4 border border-gray-500">
                    <h4 className="text-white font-medium mb-3 flex items-center space-x-2">
                      <span>📝</span>
                      <span>Yeni Not Ekle</span>
                    </h4>
                    <div className="space-y-3">
                      <div className="text-xs text-gray-400 bg-gray-700 px-3 py-1 rounded">
                        📍 Saniye: {Math.floor(currentVideoTime)} | Süre: {formatTime(currentVideoTime)}
                      </div>
                      <textarea
                          value={newNote}
                          onChange={(e) => setNewNote(e.target.value)}
                        placeholder={`Not ekle (${formatTime(currentVideoTime)}) - Örn: Bu formül burada kullanılıyor, önemli nokta, hatırlanacak bilgi...`}
                        className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 placeholder-gray-400 resize-none"
                        rows={3}
                      />
                      <button
                        onClick={addNote}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors font-medium"
                      >
                        📝 Not Ekle
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

          {/* Right Side - Questions Section */}
          <div className="bg-gray-700 rounded-2xl overflow-hidden">
            {/* Questions Header */}
            <div className="bg-gradient-to-br from-green-500 to-green-600 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-white/20 rounded-full">
                    <ChatBubbleLeftRightIcon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white">Soru & Cevap</h3>
                    <p className="text-green-100 text-sm">
                      {questions.length} soru • Aktif: {questions.filter((q) => !q.answer).length}
                    </p>
                </div>
                </div>
                <button
                  onClick={() => toggleTab("questions")}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  {expandedTabs.has("questions") ? (
                    <ChevronDownIcon className="w-5 h-5 text-white" />
                  ) : (
                    <ChevronRightIcon className="w-5 h-5 text-white" />
                  )}
              </button>
              </div>
            </div>

            {/* Questions Content */}
            {expandedTabs.has("questions") && (
              <div className="p-8 max-h-[80vh] overflow-y-auto">
                  <div className="space-y-6">
                    {questions.map((question) => (
                      <div key={question.id} className="bg-gray-600 rounded-lg p-5 hover:bg-gray-500 transition-colors">
                        <div className="flex items-start space-x-4">
                          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
                            {question.userName.charAt(0)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-3">
                              <h4 className="text-white font-medium text-lg">{question.question}</h4>
                              <div className="flex items-center space-x-2">
                                <span className="text-xs text-gray-400 bg-gray-700 px-2 py-1 rounded">
                                {new Date(question.createdAt).toLocaleDateString("tr-TR")}
                                </span>
                                <span className="text-xs text-gray-400 bg-gray-700 px-2 py-1 rounded">
                                {question.userRole === "ADMIN"
                                  ? "👑 Admin"
                                  : question.userRole === "INSTRUCTOR"
                                    ? "👨‍🏫 Eğitmen"
                                    : "👤 Öğrenci"}
                                </span>
                              </div>
                            </div>
                            
                            {question.answer && (
                              <div className="bg-blue-900/30 border-l-4 border-blue-500 p-4 rounded-r-lg mb-4">
                                <div className="flex items-center space-x-2 mb-2">
                                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                                    <span className="text-white text-xs">✓</span>
                                  </div>
                                  <span className="text-green-400 text-sm font-medium">
                                  Cevaplandı{" "}
                                  {question.answeredByRole === "ADMIN"
                                    ? "👑 Admin"
                                    : question.answeredByRole === "INSTRUCTOR"
                                      ? "👨‍🏫 Eğitmen"
                                      : "👤 Öğrenci"}{" "}
                                  tarafından
                                  </span>
                                </div>
                                <p className="text-gray-200 text-sm leading-relaxed">{question.answer}</p>
                              <div className="mt-2 text-xs text-gray-400">Cevaplayan: {question.answeredBy}</div>
                              </div>
                            )}
                            
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-4 text-sm text-gray-400">
                                <button className="flex items-center space-x-1 hover:text-white transition-colors">
                                  <span>👍</span>
                                  <span>{question.upvotes}</span>
                                </button>
                                <button className="flex items-center space-x-1 hover:text-white transition-colors">
                                  <span>👎</span>
                                  <span>{question.downvotes}</span>
                                </button>
                              {(user?.role === "ADMIN" || user?.role === "INSTRUCTOR") && (
                                  <button className="text-blue-400 hover:text-blue-300 transition-colors">
                                  {question.answer ? "Düzenle" : "Cevapla"}
                                  </button>
                                )}
                              </div>
                              
                              {!question.answer && (
                                <span className="text-yellow-400 text-xs bg-yellow-900/20 px-2 py-1 rounded-full">
                                  Cevap Bekliyor
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    <div className="bg-gray-600 rounded-lg p-5">
                      <h4 className="text-white font-medium mb-4">Yeni Soru Sor</h4>
                      <div className="space-y-4">
                        <textarea
                          value={newQuestion}
                          onChange={(e) => setNewQuestion(e.target.value)}
                          placeholder="Bu dersle ilgili sorunuzu detaylı bir şekilde yazın..."
                          rows={3}
                          className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 placeholder-gray-400 resize-none"
                        />

                      <div className="space-y-3">
                        <div className="flex items-center space-x-3">
                          <label className="cursor-pointer bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg border border-gray-500 transition-colors">
                            <input
                              type="file"
                              onChange={handleFileSelect}
                              accept="image/*,.pdf,.doc,.docx,.txt"
                              className="hidden"
                            />
                            📎 Dosya Ekle
                          </label>
                          {selectedFile && (
                            <button onClick={removeSelectedFile} className="text-red-400 hover:text-red-300 text-sm">
                              ❌ Kaldır
                          </button>
                          )}
                        </div>

                        {selectedFile && (
                          <div className="bg-gray-700 rounded-lg p-3 border border-gray-500">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                                {selectedFile.type.startsWith("image/") ? "🖼️" : "📄"}
                      </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-white text-sm font-medium truncate">{selectedFile.name}</p>
                                <p className="text-gray-400 text-xs">
                                  {formatFileSize(selectedFile.size)} • {selectedFile.type}
                                </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

                      <div className="flex items-center justify-between">
                        <div className="text-xs text-gray-400">
                          Sorunuzu net ve anlaşılır bir şekilde yazın
                          {selectedFile && ` • ${selectedFile.name} eklenecek`}
                        </div>
              <button
                          onClick={addQuestion}
                          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-colors font-medium"
                        >
                          Soru Gönder
              </button>
                            </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
            </div>
        </div>
      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
        }
        .slider::-moz-range-thumb {
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: none;
        }
      `}</style>
    </div>
  );
}
