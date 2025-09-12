"use client"

import { useState } from "react"
//import Navbar from "@/components/Navbar"
import { Button } from "@/components/ui/button"

export default function ContentManagement() {
  const [posts, setPosts] = useState([
    { id: 1, title: "أهمية التسويق الرقمي", status: "منشور" },
    { id: 2, title: "أفضل طرق جذب العملاء", status: "مسودة" },
  ])

  const deletePost = (id: number) => {
    setPosts(posts.filter((p) => p.id !== id))
  }

  return (
    <div>
      {/* <Navbar /> */}
      <main className="p-6 max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">📝 إدارة المحتوى</h1>

        <div className="mb-4 flex justify-end">
          <Button>➕ إضافة مقال جديد</Button>
        </div>

        <table className="w-full border-collapse border text-right">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-3">العنوان</th>
              <th className="border p-3">الحالة</th>
              <th className="border p-3">الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <tr key={post.id} className="hover:bg-gray-50">
                <td className="border p-3">{post.title}</td>
                <td className="border p-3">{post.status}</td>
                <td className="border p-3 space-x-2 space-x-reverse">
                  <Button variant="secondary">✏️ تعديل</Button>
                  <Button variant="destructive" onClick={() => deletePost(post.id)}>
                    🗑 حذف
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </div>
  )
}