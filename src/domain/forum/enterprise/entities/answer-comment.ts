import { AggregateRoot } from "@/core/entities/aggregate-root"
import { CommentProps } from "./comment"
import { UniqueEntityID } from "@/core/entities/unique-entity-id"
import { Optional } from "@/core/types/optional"
import { AnswerCommentCreatedEvent } from "../events/answer-comment-created-event"
import { Answer } from "./answer"

export interface AnswerCommentProps extends CommentProps {
  answerId: UniqueEntityID
}

export class AnswerComment extends AggregateRoot<AnswerCommentProps> {
  get answerId() {
    return this.props.answerId
  }

  static create(
    props: Optional<AnswerCommentProps, 'createdAt'>,
    id?: UniqueEntityID
  ) {
    const answerComment = new AnswerComment({
      ...props,
      createdAt: props.createdAt ?? new Date(),
    }, id)

    // const isNewAnswerComment = !id

    // if(isNewAnswerComment) {
    //   answerComment.addDomainEvent(new AnswerCommentCreatedEvent(answerComment))
    // }

    return answerComment
  }
}