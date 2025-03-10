"use client"

const Copyright = ({ copyright }: any) => {
  return <div dangerouslySetInnerHTML={{ __html: copyright?.body?.value }} />
}

export default Copyright
