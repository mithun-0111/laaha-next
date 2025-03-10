type Props = {
  className?: string
  children: React.ReactNode
}

const Container = ({ className, children }: Props) => (
  <div className={`node__content ${className ? className : ""}`}>
    {children}
  </div>
)

export default Container
