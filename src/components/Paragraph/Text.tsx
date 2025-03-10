const Text = (data: any) => {
  const text =
    data?.field_description?.value || data?.field_long_description?.value

  return (
    <div
      className="body-text mb-8"
      dangerouslySetInnerHTML={{ __html: text }}
    />
  )
}

export default Text
