import { useParams } from "react-router-dom"
import { useGetPostByIdQuery } from "../../app/services/postApi"
import { Card } from "../../components/card"
import { GoBack } from "../../components/go-back"
import { CreatePost } from "../../components/create-post"
import { CreateComment } from "../../components/creat-comment"

export const CurrentPost = () => {
  const params = useParams<{ id: string }>()
  const { data } = useGetPostByIdQuery(params?.id ?? "")
  if (!data) {
    return <h2>Поста не существует</h2>
  }

  const {
    content,
    id,
    authorId,
    comments,
    likes,
    author,
    likedByUser,
    createdAt
  } = data
  return (
    <>
      <GoBack />
      <Card
        avatarUrl={author.avatarUrl ?? ""}
        name={author.name ?? ""}
        authorId={authorId}
        id={id}
        likedByUser={likedByUser}
        createdAt={createdAt}
        content={content}
        likesCount={likes.length}
        commentsCount={comments.length}
        cardFor="current-post" />
      <div className='mt-10'>
        <CreateComment />
      </div>
      <div className="mt-10">
        {
          data.comments
            ? data.comments.map((comment) => (
              <Card
                cardFor="comment"
                key={comment.id}
                avatarUrl={comment.user.avatarUrl ?? ""}
                name={comment.user.name ?? ""}
                authorId={comment.user.id}
                commentId={comment.id}
                id={id}
                content={comment.content}
              />))
            : null
        }
      </div>
    </>
  )
}