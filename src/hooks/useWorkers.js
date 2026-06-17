import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export function useWorkers(filters = {}) {
  const [workers, setWorkers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetch() {
      setLoading(true)
      let query = supabase
        .from('workers')
        .select(`
          *,
          worker_services(service_category_id, service_categories(name)),
          availability(*),
          worker_badges(badge_id, badges(name, description)),
          ratings(stars, is_visible)
        `)
        .eq('is_verified', true)

      const { data, error } = await query
      if (error) { setError(error); setLoading(false); return }

      let result = data.map(w => ({
        ...w,
        avg_rating: avgRating(w.ratings),
        rating_count: w.ratings?.filter(r => r.is_visible).length ?? 0,
      }))

      if (filters.category) {
        result = result.filter(w =>
          w.worker_services?.some(s => s.service_category_id === filters.category)
        )
      }
      if (filters.availability) {
        result = result.filter(w => w.availability?.[0]?.[filters.availability])
      }
      if (filters.min_rating) {
        result = result.filter(w => w.avg_rating >= Number(filters.min_rating))
      }

      setWorkers(result)
      setLoading(false)
    }
    fetch()
  }, [filters.category, filters.availability, filters.min_rating])

  return { workers, loading, error }
}

export function useWorker(id) {
  const [worker, setWorker] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!id) return
    async function fetch() {
      const { data, error } = await supabase
        .from('workers')
        .select(`
          *,
          worker_services(service_category_id, service_categories(name)),
          availability(*),
          worker_badges(badge_id, assigned_at, badges(name, description)),
          ratings(stars, comment, created_at, is_visible, neighbors(full_name))
        `)
        .eq('id', id)
        .single()
      if (error) { setError(error); setLoading(false); return }
      setWorker({
        ...data,
        avg_rating: avgRating(data.ratings),
        rating_count: data.ratings?.filter(r => r.is_visible).length ?? 0,
        visible_ratings: data.ratings?.filter(r => r.is_visible) ?? [],
      })
      setLoading(false)
    }
    fetch()
  }, [id])

  return { worker, loading, error }
}

function avgRating(ratings) {
  const visible = ratings?.filter(r => r.is_visible) ?? []
  if (!visible.length) return 0
  return visible.reduce((sum, r) => sum + r.stars, 0) / visible.length
}
