import { Separator } from '@/components/ui/separator'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth/programmes/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div className="container max-w-2xl p-8">
    <div className="mb-8">
				<h1 className="text-3xl font-bold">Programmes</h1>
			</div>
      <div className='flex flex-col gap-4'>
        <div>
          <h2 className="text-xl pb-1">RECOS</h2>
          <Separator />
        </div>
        <div>
          <h2 className="text-xl pb-1">CRT</h2>
          <Separator />
        </div>
      </div>
  </div>
}
