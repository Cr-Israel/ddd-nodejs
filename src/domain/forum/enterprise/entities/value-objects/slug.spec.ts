import { describe, expect, it } from "vitest";

import { Slug } from "./slug";

describe('Create Slug from Text', () => {
  it('should be able to create a new slug from text', () => {
    const slug = Slug.createFromText('Example question title')

    expect(slug.value).toEqual('example-question-title')
  })
})