import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiTag, FiDollarSign, FiPackage, FiPlus, FiChevronDown, FiList } from 'react-icons/fi'
import toast from 'react-hot-toast'
import Wizard from '../components/Wizard'
import FloatingInput from '../components/FloatingInput'
import ImageUploader from '../components/ImageUploader'
import { productApi } from '../api/productApi'
import { categoryApi } from '../api/categoryApi'
import { useCurrency } from '../context/CurrencyContext'

function CategorySelect({ value, onChange, categories }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const selected = categories.find((c) => c.id === value)

  useEffect(() => {
    const onMouseDown = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    const onKeyDown = (e) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onMouseDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('mousedown', onMouseDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [])

  return (
    <div ref={ref} className="relative">
      
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="relative w-full text-left rounded-lg border border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 transition bg-transparent pt-5 pb-2 px-3 pr-10 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className="absolute left-3 top-1.5 text-xs font-medium text-gray-500 dark:text-gray-400 pointer-events-none">
          Category
        </span>
        <span className={`block truncate ${selected ? 'text-gray-900 dark:text-white' : 'text-gray-400 dark:text-gray-500'}`}>
          {selected ? selected.name : 'Choose a category'}
        </span>
      </button>

      
      <FiChevronDown
        className={`absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none transition-transform duration-200 ${
          open ? 'rotate-180' : ''
        }`}
      />

      
      {open && (
        <ul
          role="listbox"
          className="absolute z-50 left-0 right-0 top-full mt-1 max-h-60 overflow-y-auto rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-lg py-1 animate-in fade-in slide-in-from-top-1"
        >
          <li>
            <button
              type="button"
              role="option"
              aria-selected={!value}
              onClick={() => { onChange(null); setOpen(false) }}
              className={`w-full text-left px-3 py-2 text-sm transition ${
                !value
                  ? 'bg-brand-50 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300 font-medium'
                  : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              Choose a category
            </button>
          </li>
          {categories.map((c) => (
            <li key={c.id}>
              <button
                type="button"
                role="option"
                aria-selected={c.id === value}
                onClick={() => { onChange(c.id); setOpen(false) }}
                className={`w-full text-left px-3 py-2 text-sm transition ${
                  c.id === value
                    ? 'bg-brand-50 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300 font-medium'
                    : 'text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                {c.name}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

function BasicStep({ data, update, categories }) {
  return (
    <div className="space-y-4">
      <FloatingInput
        id="name"
        label="Product name"
        value={data.name || ''}
        onChange={(e) => update({ name: e.target.value })}
        icon={FiTag}
        required
      />
      <FloatingInput
        id="description"
        label="Description"
        as="textarea"
        rows={4}
        value={data.description || ''}
        onChange={(e) => update({ description: e.target.value })}
      />

      <CategorySelect
        value={data.categoryId}
        onChange={(id) => update({ categoryId: id })}
        categories={categories}
      />

      {categories.length === 0 && (
        <p className="text-xs text-amber-600 dark:text-amber-400">
          No categories available yet. Ask an admin to add some.
        </p>
      )}
    </div>
  )
}

function PricingStep({ data, update }) {
  return (
    <div className="space-y-4">
      <FloatingInput id="price" label="Price (TZS)" type="number" value={data.price || ''}
        onChange={(e) => update({ price: e.target.value })} icon={FiDollarSign} required />
      <FloatingInput id="stock" label="Stock quantity" type="number" value={data.stock || ''}
        onChange={(e) => update({ stock: e.target.value })} icon={FiPackage} required />
    </div>
  )
}

function PhotoStep({ data, update }) {
  return (
    <div>
      <label className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-2 block">Product photo</label>
      <ImageUploader file={data.imageFile} onChange={(f) => update({ imageFile: f })} />
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
        Optional — a placeholder will be shown if you skip this.
      </p>
    </div>
  )
}

function OptionsStep({ data, update }) {
  const [input, setInput] = useState('')
  const colors = data.colors || []
  const addColor = () => {
    if (input.trim() && !colors.includes(input.trim())) {
      update({ colors: [...colors, input.trim()] })
      setInput('')
    }
  }
  return (
    <div>
      <div className="flex gap-2 items-end">
        <div className="flex-1">
          <FloatingInput id="color" label="Add a color or type"
            value={input} onChange={(e) => setInput(e.target.value)} />
        </div>
        <button type="button" onClick={addColor} className="btn-secondary flex items-center gap-1 h-14">
          <FiPlus /> Add
        </button>
      </div>
      {colors.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-4">
          {colors.map((c) => (
            <span key={c} className="inline-flex items-center gap-2 px-3 py-1 bg-brand-50 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300 rounded-full text-sm">
              {c}
              <button type="button" onClick={() => update({ colors: colors.filter((x) => x !== c) })}
                className="hover:text-red-600">×</button>
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

function ReviewStep({ data, categories }) {
  const { format } = useCurrency()
  const categoryName = categories.find((c) => c.id === data.categoryId)?.name || '—'

  return (
    <div className="card dark:bg-gray-800 dark:border-gray-700 p-4 space-y-3">
      <h3 className="font-semibold text-gray-900 dark:text-white">Summary</h3>
      {data.imageFile && (
        <img src={URL.createObjectURL(data.imageFile)} alt="preview" className="max-h-40 rounded-lg" />
      )}
      <dl className="space-y-2 text-sm">
        <div className="flex justify-between gap-4"><dt className="text-gray-500 dark:text-gray-400">Name</dt><dd className="font-medium text-gray-900 dark:text-white text-right break-words">{data.name || '—'}</dd></div>
        <div className="flex justify-between gap-4"><dt className="text-gray-500 dark:text-gray-400">Category</dt><dd className="font-medium text-gray-900 dark:text-white text-right">{categoryName}</dd></div>
        <div className="flex justify-between gap-4"><dt className="text-gray-500 dark:text-gray-400">Price</dt><dd className="font-medium text-gray-900 dark:text-white text-right">{format(data.price || 0)}</dd></div>
        <div className="flex justify-between gap-4"><dt className="text-gray-500 dark:text-gray-400">Stock</dt><dd className="font-medium text-gray-900 dark:text-white text-right">{data.stock || 0}</dd></div>
        <div className="flex justify-between gap-4"><dt className="text-gray-500 dark:text-gray-400">Colors</dt><dd className="font-medium text-gray-900 dark:text-white text-right">{(data.colors || []).join(', ') || '—'}</dd></div>
      </dl>
    </div>
  )
}

export default function AddProduct() {
  const navigate = useNavigate()
  const [categories, setCategories] = useState([])
  const [error, setError] = useState('')

  useEffect(() => { categoryApi.list().then(setCategories).catch(() => {}) }, [])

  const handleComplete = async (data) => {
    setError('')
    try {
      const product = await productApi.create({
        name: data.name,
        description: data.description,
        price: parseFloat(data.price),
        stock: parseInt(data.stock || 0, 10),
        colors: data.colors || [],
        categoryId: data.categoryId ?? null,
      })

      if (data.imageFile) {
        await productApi.uploadImage(product.id, data.imageFile)
      }

      toast.success('Product published!')
      navigate('/trader/dashboard')
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to create product'
      setError(msg)
      toast.error(msg)
    }
  }

  const steps = [
    { label: 'Basic',   title: 'Basic info',      subtitle: 'Name, description, category',
      component: (p) => <BasicStep {...p} categories={categories} />, validate: (d) => d.name },
    { label: 'Pricing', title: 'Pricing & stock', subtitle: 'Set your price and inventory',
      component: PricingStep, validate: (d) => d.price && d.stock },
    { label: 'Photo',   title: 'Product photo',   subtitle: 'Upload an image (optional)',
      component: PhotoStep },
    { label: 'Options', title: 'Options',         subtitle: 'Add colors or variants (optional)',
      component: OptionsStep },
    { label: 'Review',  title: 'Review',          subtitle: 'Confirm before publishing',
      component: (p) => <ReviewStep {...p} categories={categories} /> },
  ]

  return (
    <div className="min-h-[80vh] py-12 px-4">
      <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-8">Add Product</h1>
      {error && (
        <div className="max-w-3xl mx-auto mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm dark:bg-red-900/20 dark:border-red-800 dark:text-red-300">
          {error}
        </div>
      )}
      <Wizard steps={steps} onComplete={handleComplete} submitLabel="Publish Product" />
    </div>
  )
}
