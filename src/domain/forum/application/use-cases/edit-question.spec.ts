import { EditQuestionUseCase } from "./edit-question"
import { makeQuestion } from "test/factories/make-question"
import { UniqueEntityID } from "@/core/entities/unique-entity-id"
import { InMemoryQuestionsRepository } from "test/repositories/in-memory-questions-repository"

let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let sut: EditQuestionUseCase

describe('Edit Question', async () => {
  beforeEach(() => {
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository()
    sut = new EditQuestionUseCase(inMemoryQuestionsRepository)
  })

  it('should be able to edit a question', async () => {
    const newQuestion = makeQuestion({}, new UniqueEntityID('question-1'))

    await inMemoryQuestionsRepository.create(newQuestion)

    await sut.execute({
      authorId: newQuestion.authorId.toString(),
      questionId: newQuestion.id.toString(),
      title: newQuestion.title,
      content: newQuestion.content
    })

    expect(inMemoryQuestionsRepository.items[0]).toMatchObject({
      title: newQuestion.title,
      content: newQuestion.content
    })
  })

  it('should be not able to edit a question from another user', async () => {
    const newQuestion = makeQuestion({}, new UniqueEntityID('question-1'))

    await inMemoryQuestionsRepository.create(newQuestion)

    await expect(() => {
      return sut.execute({
        authorId: 'authorId-1',
        questionId: newQuestion.id.toString(),
        title: newQuestion.title,
        content: newQuestion.content
      })
    }).rejects.toBeInstanceOf(Error)
  })
})