export default interface ServerModelInterface {
  id: number
  project_id: number
  name: string
  connect_as: string
  ip_address: string
  port: number
  project_path: string
  connection_status: number
  public_key: string
}
