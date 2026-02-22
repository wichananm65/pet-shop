export default function Header({pageName}: {pageName: string}) {

  return (
    <header className="bg-orange-50 p-4 rounded-md flex items-center gap-4">
        <div className="font-semibold text-lg">
          {pageName}
        </div>
    </header>
  )
}
