"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { Plus, Edit, Trash2, Image as ImageIcon, Star, Save, X, Upload, Video, File } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

interface PortfolioItem {
  _id: string
  title: string
  category: string
  description?: string
  image: string
  tags: string[]
  featured: boolean
  createdAt: string
  updatedAt: string
}

export function WorksManager() {
  const [works, setWorks] = useState<PortfolioItem[]>([])
  const [loading, setLoading] = useState(true)
  const [editingWork, setEditingWork] = useState<PortfolioItem | null>(null)
  const [isAdding, setIsAdding] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    description: "",
    image: "",
    tags: [] as string[],
    featured: false
  })
  const [newTag, setNewTag] = useState("")

  // Fetch works from API
  useEffect(() => {
    fetchWorks()
  }, [])

  const fetchWorks = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/portfolio')
      if (response.ok) {
        const data = await response.json()
        setWorks(data)
      }
    } catch (error) {
      console.error('Error fetching works:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files)
    }
  }

  const handleFiles = async (files: FileList) => {
    const file = files[0]
    
    // Check file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'video/webm', 'video/ogg']
    if (!allowedTypes.includes(file.type)) {
      alert('نوع الملف غير مدعوم. الرجاء اختيار صورة (JPEG, PNG, GIF, WebP) أو فيديو (MP4, WebM, OGG)')
      return
    }

    // Check file size (10MB max)
    const maxSize = 10 * 1024 * 1024
    if (file.size > maxSize) {
      alert('حجم الملف كبير جداً. الحد الأقصى 10MB')
      return
    }

    setUploading(true)

    try {
      const uploadData = new FormData()
      uploadData.append('file', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: uploadData,
      })

      if (response.ok) {
        const result = await response.json()
        setFormData(prev => ({ ...prev, image: result.url }))
      } else {
        alert('فشل في رفع الملف')
      }
    } catch (error) {
      console.error('Error uploading file:', error)
      alert('حدث خطأ أثناء رفع الملف')
    } finally {
      setUploading(false)
    }
  }

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }))
      setNewTag("")
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.image) {
      alert('الرجاء اختيار صورة أو فيديو')
      return
    }

    try {
      const url = editingWork ? `/api/portfolio/${editingWork._id}` : '/api/portfolio'
      const method = editingWork ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        await fetchWorks()
        resetForm()
      } else {
        console.error('Failed to save work')
      }
    } catch (error) {
      console.error('Error saving work:', error)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا العمل؟')) return

    try {
      const response = await fetch(`/api/portfolio/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        await fetchWorks()
      } else {
        console.error('Failed to delete work')
      }
    } catch (error) {
      console.error('Error deleting work:', error)
    }
  }

  const handleEdit = (work: PortfolioItem) => {
    setEditingWork(work)
    setIsAdding(true)
    setFormData({
      title: work.title,
      category: work.category,
      description: work.description || "",
      image: work.image,
      tags: work.tags || [],
      featured: work.featured || false
    })
  }

  const resetForm = () => {
    setFormData({
      title: "",
      category: "",
      description: "",
      image: "",
      tags: [],
      featured: false
    })
    setEditingWork(null)
    setIsAdding(false)
    setNewTag("")
  }

  const getFileType = (url: string) => {
    if (url.match(/\.(mp4|webm|ogg)$/i)) return 'video'
    if (url.match(/\.(gif)$/i)) return 'gif'
    return 'image'
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-blue mx-auto mb-4"></div>
            <p className="text-muted-foreground">جاري تحميل الأعمال...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">إدارة أعمالنا</h1>
          <p className="text-muted-foreground mt-2">إدارة وعرض أعمال الشركة في قسم أعمالنا</p>
        </div>
        <Button onClick={() => setIsAdding(true)} className="gap-2">
          <Plus className="w-4 h-4" />
          إضافة عمل جديد
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Works List */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-xl font-semibold">قائمة الأعمال ({works.length})</h2>
          
          {works.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center">
                <ImageIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">لا توجد أعمال لعرضها</p>
                <Button onClick={() => setIsAdding(true)} className="mt-4">
                  إضافة العمل الأول
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {works.map((work, index) => (
                <motion.div
                  key={work._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="h-full">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-lg line-clamp-1">{work.title}</h3>
                          {work.featured && (
                            <Badge variant="secondary" className="gap-1">
                              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                              مميز
                            </Badge>
                          )}
                        </div>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(work)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(work._id)}
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </Button>
                        </div>
                      </div>

                      <div className="aspect-video relative bg-muted rounded-lg mb-3">
                        {getFileType(work.image) === 'video' ? (
                          <video
                            src={work.image}
                            className="w-full h-full object-cover rounded-lg"
                            controls
                          />
                        ) : (
                          <img
                            src={work.image}
                            alt={work.title}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        )}
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <Badge variant="outline">{work.category}</Badge>
                          <span className="text-xs text-muted-foreground">
                            {new Date(work.createdAt).toLocaleDateString('ar-EG')}
                          </span>
                        </div>

                        {work.description && (
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {work.description}
                          </p>
                        )}

                        {work.tags && work.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {work.tags.slice(0, 3).map((tag, tagIndex) => (
                              <Badge key={tagIndex} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                            {work.tags.length > 3 && (
                              <Badge variant="secondary" className="text-xs">
                                +{work.tags.length - 3}
                              </Badge>
                            )}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Add/Edit Form */}
        {(isAdding || editingWork) && (
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{editingWork ? 'تعديل العمل' : 'إضافة عمل جديد'}</span>
                  <Button variant="ghost" size="icon" onClick={resetForm}>
                    <X className="w-4 h-4" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">عنوان العمل</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="أدخل عنوان العمل"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">التصنيف</Label>
                    <Input
                      id="category"
                      value={formData.category}
                      onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                      placeholder="أدخل تصنيف العمل"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">الوصف</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="أدخل وصف العمل"
                      rows={3}
                    />
                  </div>

                  {/* File Upload Section */}
                  <div className="space-y-2">
                    <Label>رفع صورة أو فيديو</Label>
                    
                    {/* Preview */}
                    {formData.image && (
                      <div className="mb-4">
                        <p className="text-sm text-muted-foreground mb-2">المعاينة:</p>
                        <div className="aspect-video relative bg-muted rounded-lg border">
                          {getFileType(formData.image) === 'video' ? (
                            <video
                              src={formData.image}
                              className="w-full h-full object-contain rounded-lg"
                              controls
                            />
                          ) : (
                            <img
                              src={formData.image}
                              alt="Preview"
                              className="w-full h-full object-contain rounded-lg"
                            />
                          )}
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="mt-2"
                          onClick={() => setFormData(prev => ({ ...prev, image: "" }))}
                        >
                          <X className="w-3 h-3 ml-1" />
                          إزالة
                        </Button>
                      </div>
                    )}

                    {/* Drag & Drop Area */}
                    <div
                      className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                        dragActive 
                          ? 'border-brand-blue bg-brand-blue/10' 
                          : 'border-muted-foreground/25 hover:border-muted-foreground/50'
                      } ${uploading ? 'opacity-50' : ''}`}
                      onDragEnter={handleDrag}
                      onDragLeave={handleDrag}
                      onDragOver={handleDrag}
                      onDrop={handleDrop}
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        className="hidden"
                        accept="image/*,video/*"
                        onChange={handleFileSelect}
                        disabled={uploading}
                      />
                      
                      {uploading ? (
                        <div className="flex flex-col items-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-blue mb-2"></div>
                          <p className="text-sm text-muted-foreground">جاري رفع الملف...</p>
                        </div>
                      ) : (
                        <>
                          <div className="flex flex-col items-center mb-3">
                            <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                            <p className="font-medium">اسحب وأفلت الملف هنا</p>
                            <p className="text-sm text-muted-foreground mt-1">أو</p>
                          </div>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => fileInputRef.current?.click()}
                            className="gap-2"
                          >
                            <File className="w-4 h-4" />
                            اختر ملف
                          </Button>
                          <p className="text-xs text-muted-foreground mt-3">
                            الصور: JPG, PNG, GIF, WebP • الفيديوهات: MP4, WebM, OGG
                            <br />
                            الحد الأقصى: 10MB
                          </p>
                        </>
                      )}
                    </div>

                    {/* Manual URL Input (Fallback) */}
                    <div className="mt-4">
                      <Label htmlFor="image-url">أو أدخل رابط مباشر</Label>
                      <Input
                        id="image-url"
                        value={formData.image}
                        onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
                        placeholder="https://example.com/image.jpg"
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>الكلمات المفتاحية</Label>
                    <div className="flex gap-2">
                      <Input
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        placeholder="أدخل كلمة مفتاحية"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault()
                            handleAddTag()
                          }
                        }}
                      />
                      <Button type="button" onClick={handleAddTag}>
                        إضافة
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {formData.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="gap-1">
                          {tag}
                          <button
                            type="button"
                            onClick={() => handleRemoveTag(tag)}
                            className="hover:text-red-500"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="featured">عمل مميز</Label>
                    <Switch
                      id="featured"
                      checked={formData.featured}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, featured: checked }))}
                    />
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button 
                      type="submit" 
                      className="flex-1 gap-2"
                      disabled={!formData.image || uploading}
                    >
                      <Save className="w-4 h-4" />
                      {editingWork ? 'تحديث' : 'حفظ'}
                    </Button>
                    <Button type="button" variant="outline" onClick={resetForm}>
                      إلغاء
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}