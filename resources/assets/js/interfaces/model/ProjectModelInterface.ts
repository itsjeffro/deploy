import ServerModelInterface from "./ServerModelInterface";

export default interface ProjectModelInterface {
  id: number
  servers?: ServerModelInterface[]
}
