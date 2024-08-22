import { DeleteAnswerCommentUseCase } from "./delete-answer-comment"
import { InMemoryAnswerCommentsRepository } from "test/repositories/in-memory-answer-comments-repository"

import { makeAnswerComment } from "test/factories/make-answer-comment"

let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository
let sut: DeleteAnswerCommentUseCase

describe('Delete Answer Comment', async () => {
  beforeEach(() => {
    inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentsRepository()
    sut = new DeleteAnswerCommentUseCase(inMemoryAnswerCommentsRepository)
  })

  it('should be able to delete a answer comment', async () => {
    const answerComment = makeAnswerComment()
    await inMemoryAnswerCommentsRepository.create(answerComment)

    await sut.execute({
      authorId: answerComment.authorId.toString(),
      answerCommentId: answerComment.id.toString(),
    })

    expect(inMemoryAnswerCommentsRepository.items).toHaveLength(0)
  })

  it('should not be able to delete another user answer comment', async () => {
    const answerComment = makeAnswerComment()
    await inMemoryAnswerCommentsRepository.create(answerComment)

    await expect(() => {
      return sut.execute({
        authorId: 'another - author-1',
        answerCommentId: answerComment.id.toString(),
      })
    }).rejects.toBeInstanceOf(Error)
  })

  it('should not be able to an non-existent answer comment', async () => {
    const answerComment = makeAnswerComment()
    await inMemoryAnswerCommentsRepository.create(answerComment)

    await expect(() => {
      return sut.execute({
        authorId: answerComment.authorId.toString(),
        answerCommentId: 'answerComment-1',
      })
    }).rejects.toBeInstanceOf(Error)
  })
})