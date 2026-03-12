'use client'

import { useState } from 'react'
import { Car } from '@/types/database'

interface CarListProps {
  initialCars: Car[]
}

export default function CarList({ initialCars }: CarListProps) {
  const [cars, setCars] = useState<Car[]>(initialCars)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState({ name: '', stock: 0, image_url: '' })
  const [isAdding, setIsAdding] = useState(false)
  const [newCarForm, setNewCarForm] = useState({ name: '', stock: 0, image_url: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // 开始编辑
  const startEdit = (car: Car) => {
    setEditingId(car.id)
    setEditForm({
      name: car.name,
      stock: car.stock,
      image_url: car.image_url || ''
    })
  }

  // 取消编辑
  const cancelEdit = () => {
    setEditingId(null)
    setEditForm({ name: '', stock: 0, image_url: '' })
  }

  // 保存编辑
  const saveEdit = async (id: string) => {
    setLoading(true)
    setError('')

    try {
      const response = await fetch(`/api/cars/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm)
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || '更新失败')
      }

      // 更新本地数据
      setCars(cars.map(car => car.id === id ? result.data : car))
      setEditingId(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : '更新失败')
    } finally {
      setLoading(false)
    }
  }

  // 添加车型
  const addCar = async () => {
    if (!newCarForm.name.trim()) {
      setError('请输入车型名称')
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/cars', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCarForm)
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || '添加失败')
      }

      // 添加到列表
      setCars([result.data, ...cars])
      setIsAdding(false)
      setNewCarForm({ name: '', stock: 0, image_url: '' })
    } catch (err) {
      setError(err instanceof Error ? err.message : '添加失败')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      {/* 错误提示 */}
      {error && (
        <div className="mx-6 mt-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* 添加按钮 */}
      <div className="p-6 border-b border-gray-200">
        {!isAdding ? (
          <button
            onClick={() => setIsAdding(true)}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            + 添加车型
          </button>
        ) : (
          <div className="bg-gray-50 rounded-lg p-4 border-2 border-blue-200">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">添加新车型</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm text-gray-700 mb-1">车型名称 *</label>
                <input
                  type="text"
                  value={newCarForm.name}
                  onChange={(e) => setNewCarForm({ ...newCarForm, name: e.target.value })}
                  placeholder="例如: Model S 高性能版"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">库存数量</label>
                <input
                  type="number"
                  value={newCarForm.stock}
                  onChange={(e) => setNewCarForm({ ...newCarForm, stock: parseInt(e.target.value) || 0 })}
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">图片链接</label>
                <input
                  type="url"
                  value={newCarForm.image_url}
                  onChange={(e) => setNewCarForm({ ...newCarForm, image_url: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={addCar}
                disabled={loading}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50"
              >
                {loading ? '添加中...' : '确认添加'}
              </button>
              <button
                onClick={() => {
                  setIsAdding(false)
                  setNewCarForm({ name: '', stock: 0, image_url: '' })
                  setError('')
                }}
                className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors font-medium"
              >
                取消
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 车型列表 */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                车型名称
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                库存
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                图片链接
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                创建时间
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                操作
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {cars.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                  暂无车型数据
                </td>
              </tr>
            ) : (
              cars.map((car) => (
                <tr key={car.id} className="hover:bg-gray-50">
                  {editingId === car.id ? (
                    // 编辑模式
                    <>
                      <td className="px-6 py-4">
                        <input
                          type="text"
                          value={editForm.name}
                          onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <input
                          type="number"
                          value={editForm.stock}
                          onChange={(e) => setEditForm({ ...editForm, stock: parseInt(e.target.value) || 0 })}
                          min="0"
                          className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <input
                          type="url"
                          value={editForm.image_url}
                          onChange={(e) => setEditForm({ ...editForm, image_url: e.target.value })}
                          placeholder="https://..."
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                        />
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {new Date(car.created_at).toLocaleDateString('zh-CN')}
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <button
                          onClick={() => saveEdit(car.id)}
                          disabled={loading}
                          className="text-green-600 hover:text-green-800 font-medium disabled:opacity-50"
                        >
                          保存
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="text-gray-600 hover:text-gray-800 font-medium"
                        >
                          取消
                        </button>
                      </td>
                    </>
                  ) : (
                    // 查看模式
                    <>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {car.image_url && (
                            <img
                              src={car.image_url}
                              alt={car.name}
                              className="w-12 h-12 rounded-lg object-cover"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none'
                              }}
                            />
                          )}
                          <span className="text-sm font-medium text-gray-900">{car.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          car.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {car.stock} 辆
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                        {car.image_url || '-'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {new Date(car.created_at).toLocaleDateString('zh-CN')}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => startEdit(car)}
                          className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                          编辑
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
