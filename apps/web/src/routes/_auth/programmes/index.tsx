import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { createFileRoute } from '@tanstack/react-router'
import { MapPlus } from 'lucide-react';
import { useState } from 'react';
import {
  Stepper,
  StepperContent,
  StepperIndicator,
  StepperItem,
  StepperNav,
  StepperPanel,
  StepperSeparator,
  StepperTrigger,
} from "@/components/layout/stepper"

export const Route = createFileRoute('/_auth/programmes/')({
  component: RouteComponent,
})

function RouteComponent() {
  const [open, setOpen] = useState(false);
  return <div className="container mx-auto p-8 space-y-6">
    <div className="mb-8">
      <div className='flex items-center justify-between'>
				<h1 className="text-3xl font-bold">Mes programmes</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
          <Button className="text-secondary-foreground">
          <MapPlus/>
          Créer mon programme
          </Button>
          </DialogTrigger>
          <DialogContent>
          <DialogHeader>
          <DialogTitle>Nouveau Programme</DialogTitle>
          </DialogHeader>
          <ProgramPattern />
          </DialogContent>
        </Dialog>
      </div>
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

const steps = [1, 2]

function ProgramPattern() {
  return (
    <Stepper className="w-full max-w-md space-y-8">
      <StepperNav>
        {steps.map((step) => (
          <StepperItem key={step} step={step}>
            <StepperTrigger>
              <StepperIndicator>{step}</StepperIndicator>
            </StepperTrigger>
            {steps.length > step && (
              <StepperSeparator className="group-data-[state=completed]/step:bg-primary" />
            )}
          </StepperItem>
        ))}
      </StepperNav>

      <StepperPanel className="text-sm">
        {steps.map((step) => (
          <StepperContent
            key={step}
            value={step}
            className="flex items-center justify-center"
          >
            Step {step} content
          </StepperContent>
        ))}
      </StepperPanel>
    </Stepper>
  )
}
