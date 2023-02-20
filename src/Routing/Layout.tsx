import React, { useEffect } from "react"
import flowRight from "lodash/flowRight"
import withAuth from "HOC/withAuth"

interface Props {
  displayHeader?: boolean
  displayFooter?: boolean
  children: JSX.Element
  pageTitle?: string
  photo?: string
}

const Layout: React.FC<Props> = ({ children, pageTitle }) => {
  const title = "Renora"

  useEffect(() => {
    document.title = title
    if (pageTitle) document.title = `${title} | ${pageTitle}`
  }, [pageTitle])

  return (
    <div className="flex-1 h-full">
      <div>{children}</div>
    </div>
  )
}

export default flowRight(withAuth)(Layout)
