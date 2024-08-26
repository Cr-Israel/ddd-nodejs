import { UniqueEntityID } from "@/core/entities/unique-entity-id"

import { EditAnswerUseCase } from "./edit-answer"
import { InMemoryAnswersRepository } from "test/repositories/in-memory-answers-repository"

import { makeAnswer } from "test/factories/make-answer"

import { NotAllowedError } from "./errors/not-allowed-error"

let inMemoryAnswersRepository: InMemoryAnswersRepository
let sut: EditAnswerUseCase

describe('Edit Answer', async () => {
  beforeEach(() => {
    inMemoryAnswersRepository = new InMemoryAnswersRepository()
    sut = new EditAnswerUseCase(inMemoryAnswersRepository)
  })

  it('should be able to edit a answer', async () => {
    const newAnswer = makeAnswer({}, new UniqueEntityID('answer-1'))

    await inMemoryAnswersRepository.create(newAnswer)

    await sut.execute({
      authorId: newAnswer.authorId.toString(),
      answerId: newAnswer.id.toString(),
      content: newAnswer.content
    })

    expect(inMemoryAnswersRepository.items[0]).toMatchObject({
      content: newAnswer.content
    })
  })

  it('should be not able to edit a answer from another user', async () => {
    const newAnswer = makeAnswer({}, new UniqueEntityID('answer-1'))

    await inMemoryAnswersRepository.create(newAnswer)

    const result = await sut.execute({
      authorId: 'authorId-1',
      answerId: newAnswer.id.toString(),
      content: newAnswer.content
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})