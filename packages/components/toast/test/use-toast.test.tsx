import * as React from "react"
import { render, screen, waitFor } from "@chakra-ui/test-utils"
import { ToastProvider, useToast } from "../src"

describe("useToast", () => {
  beforeEach(async () => {
    const toasts = screen.queryAllByRole("listitem")
    await Promise.all(
      toasts.map((toasts) =>
        waitFor(() => expect(toasts).not.toBeInTheDocument()),
      ),
    )
  })

  it("should accept default options", async () => {
    const title = "Yay!"

    const description = "Something awesome happened"

    const TestComponent = () => {
      const toast = useToast()
      return (
        <button onClick={() => toast({ title, description })}>Toast</button>
      )
    }

    const { user } = render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>,
    )

    const button = await screen.findByText("Toast")
    await user.click(button)

    const allByTitle = await screen.findAllByText(title)
    const allByDescription = await screen.findAllByText(description)

    expect(allByTitle).toHaveLength(1)
    expect(allByDescription).toHaveLength(1)
  })

  it("should override default options", async () => {
    const defaultTitle = "Yay!"
    const defaultDescription = "Something awesome happened"

    const title = "Hooray!"
    const description = "Something splendid happened"

    const TestComponent = () => {
      const toast = useToast({
        title: defaultTitle,
        description: defaultDescription,
      })
      return (
        <button onClick={() => toast({ title, description })}>Toast</button>
      )
    }

    const { user } = render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>,
    )

    const button = await screen.findByText("Toast")
    await user.click(button)

    const allByTitle = await screen.findAllByText(title)
    const allByDescription = await screen.findAllByText(description)

    expect(allByTitle).toHaveLength(1)
    expect(allByDescription).toHaveLength(1)
  })

  it("should allow promise toast chainings", async () => {
    const loadingTitle = "Toast is loading"
    const successTitle = "Promise resolved"
    const errorTitle = "Error occurred"
    const sleepTime = 500
    const dummyPromise = new Promise<{ payload: string }>((r) =>
      setTimeout(r, sleepTime, { payload: successTitle }),
    )

    const TestComponent = () => {
      const toast = useToast()

      return (
        <button
          onClick={() =>
            toast.promise(dummyPromise, {
              loading: {
                title: loadingTitle,
              },
              success: (data) => ({
                title: data.payload,
              }),
              error: () => ({
                title: errorTitle,
              }),
            })
          }
        >
          Toast
        </button>
      )
    }

    const { user } = render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>,
    )

    const button = screen.getByText("Toast")
    await user.click(button)

    const loadingText = await screen.findByText(loadingTitle)
    expect(loadingText).toBeInTheDocument()

    const successText = await screen.findByText(successTitle)
    expect(successText).toBeInTheDocument()
  })

  it("should accept top level options", async () => {
    const title = "Yay!"

    const description = "Something awesome happened"

    const TestComponent = () => {
      const toast = useToast()
      return <button onClick={() => toast()}>Toast</button>
    }

    const { user } = render(
      <ToastProvider defaultOptions={{ title, description }}>
        <TestComponent />
      </ToastProvider>,
    )

    const button = await screen.findByText("Toast")
    await user.click(button)

    const allByTitle = await screen.findAllByText(title)
    const allByDescription = await screen.findAllByText(description)

    expect(allByTitle).toHaveLength(1)
    expect(allByDescription).toHaveLength(1)
  })

  it("toast function should override top level default options", async () => {
    const defaultTitle = "Yay!"
    const defaultDescription = "Something awesome happened"

    const title = "Hooray!"
    const description = "Something splendid happened"

    const TestComponent = () => {
      const toast = useToast()
      return (
        <button onClick={() => toast({ title, description })}>Toast</button>
      )
    }

    const { user } = render(
      <ToastProvider
        defaultOptions={{
          title: defaultTitle,
          description: defaultDescription,
        }}
      >
        <TestComponent />
      </ToastProvider>,
    )

    const button = await screen.findByText("Toast")
    await user.click(button)

    const allByTitle = await screen.findAllByText(title)
    const allByDescription = await screen.findAllByText(description)

    expect(allByTitle).toHaveLength(1)
    expect(allByDescription).toHaveLength(1)
  })

  it("hook's defaults should override top level default options", async () => {
    const defaultTitle = "Yay!"
    const defaultDescription = "Something awesome happened"

    const title = "Hooray!"
    const description = "Something splendid happened"

    const TestComponent = () => {
      const toast = useToast({ title, description })
      return <button onClick={() => toast()}>Toast</button>
    }

    const { user } = render(
      <ToastProvider
        defaultOptions={{
          title: defaultTitle,
          description: defaultDescription,
        }}
      >
        <TestComponent />
      </ToastProvider>,
    )

    const button = await screen.findByText("Toast")
    await user.click(button)

    const allByTitle = await screen.findAllByText(title)
    const allByDescription = await screen.findAllByText(description)

    expect(allByTitle).toHaveLength(1)
    expect(allByDescription).toHaveLength(1)
  })
})

it("toast function should should override hook and top level default options", async () => {
  const defaultTitle = "Yay!"
  const defaultDescription = "Something awesome happened"

  const hookTitle = "Hooray!"
  const hookDescription = "Something splendid happened"

  const title = "Great!"
  const description = "Something great happened"

  const TestComponent = () => {
    const toast = useToast({ title: hookTitle, description: hookDescription })
    return <button onClick={() => toast({ title, description })}>Toast</button>
  }

  const { user } = render(
    <ToastProvider
      defaultOptions={{
        title: defaultTitle,
        description: defaultDescription,
      }}
    >
      <TestComponent />
    </ToastProvider>,
  )

  const button = await screen.findByText("Toast")
  await user.click(button)

  const allByTitle = await screen.findAllByText(title)
  const allByDescription = await screen.findAllByText(description)

  expect(allByTitle).toHaveLength(1)
  expect(allByDescription).toHaveLength(1)
})
