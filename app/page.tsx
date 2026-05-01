import { supabase } from '../lib/supabaseClient'

export const revalidate = 0

export default async function Home() {
  const { data: post, error } = await supabase
    .from('posts')
    .select('*')
    .eq('is_current', true)
    .single()

  if (error) {
    console.error(error)
  }

  if (!post) return <div>იტვირთება...</div>

  return (
    <main>
      <h1>{post.title}</h1>
      <img src={post.image_url} alt="AI News" />
      <p>{post.content}</p>
      <span>ქულა: {post.importance_score}</span>
    </main>
  )
}