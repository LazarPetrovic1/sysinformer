import ProcessTable from "../ProcessTable"

export default function topProcessesTable({ processes }) {
  return (
    <>
      <h4>Most memory-intensive processes</h4>
      <ProcessTable processes={processes} />
    </>
  )
}