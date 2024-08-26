import { UniqueEntityID } from "@/core/entities/unique-entity-id"

import { DeleteQuestionUseCase } from "./delete-question"
import { InMemoryQuestionsRepository } from "test/repositories/in-memory-questions-repository"

import { makeQuestion } from "test/factories/make-question"
import { NotAllowedError } from "./errors/not-allowed-error"

let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let sut: DeleteQuestionUseCase

describe('Delete Question', async () => {
  beforeEach(() => {
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository()
    sut = new DeleteQuestionUseCase(inMemoryQuestionsRepository)
  })

  it('should be able to delete a question', async () => {
    const newQuestion = makeQuestion({}, new UniqueEntityID('question-1'))

    await inMemoryQuestionsRepository.create(newQuestion)

    await sut.execute({
      questionId: newQuestion.id.toString(),
      authorId: newQuestion.authorId.toString(),
      // questionId: 'question-1'
    })

    expect(inMemoryQuestionsRepository.items).toHaveLength(0)
  })

  it('should be not able to delete a question from another user', async () => {
    const newQuestion = makeQuestion({}, new UniqueEntityID('question-1'))

    await inMemoryQuestionsRepository.create(newQuestion)

    const result = await sut.execute({
      questionId: newQuestion.id.toString(),
      authorId: 'author-2',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})