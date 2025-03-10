const Layout = ({ children, layout_id }: any) => {
  return <div className={`layout ${layout_id}`}>{children}</div>
}

export default Layout
