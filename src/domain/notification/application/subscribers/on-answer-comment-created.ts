import { DomainEvents } from "@/core/events/domain-events";
import { EventHandler } from "@/core/events/event-handler";

import { SendNotificationUseCase } from "../use-cases/send-notification";

import { AnswersRepository } from "@/domain/forum/application/repositories/answers-repository";
import { AnswerCommentCreatedEvent } from "@/domain/forum/enterprise/events/answer-comment-created-event";

export class OnAnswerCommentCreatedChosen implements EventHandler {
  constructor(
    private answersRepository: AnswersRepository,
    private sendNotificationUseCase: SendNotificationUseCase
  ) {
    this.setupSubscriptions()
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.sendAnswerCommentCreatedNotification.bind(this),
      AnswerCommentCreatedEvent.name)
  }

  private async sendAnswerCommentCreatedNotification({
    answerComment
  }: AnswerCommentCreatedEvent) {
    const answer = await this.answersRepository.findById(answerComment.answerId.toString())

    if (answer) {
      await this.sendNotificationUseCase.execute({
        recipientId: answer.authorId.toString(),
        title: `Nova resposta no seu comentário.`,
        content: `Uma nova resposta no seu comentário.`,
      })
    }
  }
}