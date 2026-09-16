import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { FiTag, FiDollarSign, FiPackage, FiList } from 'react-icons/fi'
import toast from 'react-hot-toast'
import { productApi } from '../api/productApi'
import { categoryApi } from '../api/categoryApi'
import FloatingInput from '../components/FloatingInput'
import ImageUploader from '../components/ImageUploader'
import Spinner from '../components/Spinner'

export default function EditProduct() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [form, setForm] = useState(null)
  const [imageFile, setImageFile] = useState(null)
  const [existingImage, setExistingImage] = useState(null)
  const [categories, setCategories] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    Promise.all([productApi.get(id), categoryApi.list()]).then(([p, c]) => {
      setForm({
        name: p.name, description: p.description || '',
        price: p.price, stock: p.stock,
        categoryId: p.categoryId || '',
      })
      setExistingImage(p.imageUrl)
      setCategories(c)
    })
  }, [id])

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      await productApi.update(id, {
        ...form,
        price: parseFloat(form.price),
        stock: parseInt(form.stock),
        categoryId: form.categoryId || null,
      })
      if (imageFile) {
        await productApi.uploadImage(id, imageFile)
      }
      toast.success('Product updated')
      navigate('/trader/dashboard')
    } catch (err) {
      const msg = err.response?.data?.message || 'Update failed'
      setError(msg)
      toast.error(msg)
    }
  }

  if (!form) return <Spinner size="lg" />

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Edit Product</h1>
      {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">{error}</div>}
      <form onSubmit={submit} className="card dark:bg-gray-800 dark:border-gray-700 p-6 space-y-4">
        <FloatingInput id="name" label="Product name" value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })} icon={FiTag} required />
        <FloatingInput id="description" label="Description" as="textarea" rows={4}
          value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        <div className="relative rounded-lg border border-gray-300 dark:border-gray-600 hover:border-gray-400 transition">
          <select value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
            className="w-full bg-transparent pt-5 pb-2 px-3 outline-none text-gray-900 dark:text-white appearance-none">
            <option value="">Uncategorized</option>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <span className="absolute left-3 top-1.5 text-xs font-medium text-gray-500 dark:text-gray-400 pointer-events-none">Category</span>
          <FiList className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FloatingInput id="price" label="Price (TZS)" type="number" value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })} icon={FiDollarSign} required />
          <FloatingInput id="stock" label="Stock" type="number" value={form.stock}
            onChange={(e) => setForm({ ...form, stock: e.target.value })} icon={FiPackage} required />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-2 block">Product photo</label>
          <ImageUploader
            file={imageFile}
            onChange={setImageFile}
            existingUrl={imageFile ? null : existingImage}
          />
        </div>

        <div className="flex gap-3 pt-4">
          <button type="button" onClick={() => navigate('/trader/dashboard')} className="btn-secondary">Cancel</button>
          <button type="submit" className="btn-primary">Save Changes</button>
        </div>
      </form>
    </div>
  )
}