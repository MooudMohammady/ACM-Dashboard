import { Fragment, useState } from 'react'
import { cn } from './lib/utils'
import { Dialog, Transition } from '@headlessui/react'

interface ITeam {
  name: string
  answers: {
    id: number
    value: string
    isFirstToAnswer: boolean
  }[]
}

function App(): JSX.Element {
  // const ipcHandle = (): void => window.context.ipcRenderer.send('ping')
  const [modalOpen, setModalOpen] = useState(false)
  const [teams, setTeams] = useState<ITeam[]>([
    {
      name: 'MMA',
      answers: [
        {
          id: 1,
          value: '11:45',
          isFirstToAnswer: true
        },
        {
          id: 2,
          value: '',
          isFirstToAnswer: false
        },
        {
          id: 3,
          value: '12:30',
          isFirstToAnswer: false
        }
      ]
    }
  ])
  const [questions, setQuestions] = useState(['A', 'B', 'C'])
  const [selected, setSelected] = useState<ITeam>()
  const [selectedId, setSelectedId] = useState<number>(0)

  const clickHandler = (team: ITeam, id) => {
    setModalOpen(true)
    setSelected(team)
    setSelectedId(id)
  }

  const modalCloseHandler = () => {
    setModalOpen(false)
  }

  const submitFormHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    let newTime =
      e.currentTarget.newTime.value || `${new Date().getHours()}:${new Date().getMinutes()}`
    let isFirstToAnswerValue = e.currentTarget.isFirstToAnswer.checked
    setTeams((pervTeams) => {
      return pervTeams.map((team) => {
        if (team.name === selected?.name) {
          const updatedAnswers = team.answers.map((answer) => {
            if (answer.id === selectedId) {
              return { ...answer, value: newTime, isFirstToAnswer: isFirstToAnswerValue }
            }
            return answer
          })
          return { ...team, answers: updatedAnswers }
        }
        return team
      })
    })
    setModalOpen(false)
  }

  return (
    <main className="flex items-center justify-center h-screen">
      <table className="table-fixed max-w-lg border-collapse border">
        <thead>
          <tr className='border'>
            <th>Teams</th>
            {questions.map((q, i) => (
              <th key={i} className="border">
                {q}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {teams.map((team, index) => (
            <tr key={index}>
              <td>{team.name}</td>
              {team.answers.map((a, i) => (
                <td
                  key={i}
                  className={cn(
                    'p-2 border min-w-16 text-center cursor-pointer',
                    a.value && 'bg-emerald-300',
                    a.isFirstToAnswer && 'bg-emerald-700'
                  )}
                  onClick={() => clickHandler(team, a.id)}
                >
                  {a.value || '-'}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <Transition appear show={modalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={modalCloseHandler}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900 mb-3"
                  >
                    Select
                  </Dialog.Title>
                  <div className="flex flex-col gap-3">
                    <form className="flex flex-col gap-2" onSubmit={submitFormHandler} action="">
                      <button
                        type="submit"
                        className="py-2 shadow-md rounded-md border hover:bg-sky-500 transition-all hover:shadow-lg hover:text-white"
                      >
                        This time
                      </button>
                      <div className="flex gap-2 items-center">
                        <label htmlFor="isFirstToAnswer">Is first to answer</label>
                        <input
                          type="checkbox"
                          name="isFirstToAnswer"
                          id="isFirstToAnswer"
                          defaultChecked={
                            selected?.answers.filter((a) => a.id === selectedId)[0].isFirstToAnswer
                          }
                          className="w-4 h-4"
                        />
                      </div>
                      <div className="flex">
                        <input
                          type="text"
                          className="p-2 border rounded-l-md w-full shadow-inner"
                          name="newTime"
                          placeholder="example 11:52"
                        />
                        <button type="submit" className="p-2 border rounded-r-md">
                          submit
                        </button>
                      </div>
                    </form>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </main>
  )
}

export default App
