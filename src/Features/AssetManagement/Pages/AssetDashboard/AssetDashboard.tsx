import { Fragment, useState, useEffect } from "react"
import { Dialog, Menu, Transition } from "@headlessui/react"
import {
  ArrowLeftOnRectangleIcon,
  Bars3BottomLeftIcon,
  CurrencyDollarIcon,
  FolderIcon,
  UserIcon,
  UsersIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline"
import { MagnifyingGlassIcon } from "@heroicons/react/20/solid"
import ReactECharts from "echarts-for-react"
import useAxios from "axios-hooks"
import CryptoConvert from "crypto-convert"

import { clearUserSession } from "Utils"
import CryptoIcons from "Assets/Images/Crypto"
import renoraIcon from "Assets/Images/renoraIcon.png"

const navigation = [
  { name: "Assets", onClick: () => {}, icon: FolderIcon, current: true },
  { name: "Invitations", onClick: () => {}, icon: UsersIcon, current: false },
  { name: "Asset Sources", onClick: () => {}, icon: FolderIcon, current: false },
  { name: "Profile", onClick: () => {}, icon: UserIcon, current: false },
  { name: "Billing", onClick: () => {}, icon: CurrencyDollarIcon, current: false },
  {
    name: "Sign Out",
    onClick: () => {
      clearUserSession()
      window.location.replace("/login")
    },
    icon: ArrowLeftOnRectangleIcon,
    current: false,
  },
]

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ")
}

interface IAssetDashboardProps {}

interface IAsset {
  id: string
  owner: number
  asset: number
  asset_name: string
  exchange: string
  amount: number
  realizedPl: number
  unrealizedPl: number
  totalPl: number
}
const convert = new CryptoConvert(/*options?*/)

const AssetDashboard = (props: IAssetDashboardProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isConvertReady, setIsConvertReady] = useState(false)
  const accessToken = localStorage.getItem("accessToken")

  const [{ data: userDetails, loading: userDetailsLoading }, refetchUserDetails] =
    useAxios(`users/me/`)

  const [{ data: assets, loading: assetsLoading }, refetchAssets] = useAxios(`assets/me/`)

  const netWorth = userDetails
    ? Number(userDetails?.data?.realizedReturns) + Number(userDetails?.data?.unrealizedReturns)
    : 0

  useEffect(() => {
    if (!convert.isReady) readyConvert()
  }, [convert.isReady])

  const option = !userDetails
    ? {
        series: [
          {
            type: "treemap",
            data: [
              {
                name: "nodeA", // First tree
                value: 10,
                children: [
                  {
                    name: "nodeAa", // First leaf of first tree
                    value: 4,
                  },
                  {
                    name: "nodeAb", // Second leaf of first tree
                    value: 6,
                  },
                ],
              },
              {
                name: "nodeB", // Second tree
                value: 20,
                children: [
                  {
                    name: "nodeBa", // Son of first tree
                    value: 20,
                    children: [
                      {
                        name: "nodeBa1", // Granson of first tree
                        value: 20,
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      }
    : {
        series: [
          {
            type: "treemap",
            data: [
              {
                name: "Net Worth", // First tree
                value: netWorth,
                children: [
                  {
                    name: "Realized Returns", // First leaf of first tree
                    value: Number(userDetails.data?.realizedReturns),
                  },
                  {
                    name: "Unrealized Returns", // Second leaf of first tree
                    value: Number(userDetails.data?.unrealizedReturns),
                  },
                ],
              },
              // {
              //   name: "nodeB", // Second tree
              //   value: 20,
              //   children: [
              //     {
              //       name: "nodeBa", // Son of first tree
              //       value: 20,
              //       children: [
              //         {
              //           name: "nodeBa1", // Granson of first tree
              //           value: 20,
              //         },
              //       ],
              //     },
              //   ],
              // },
            ],
          },
        ],
      }

  return (
    <div>
      <Transition.Root show={sidebarOpen} as={Fragment}>
        <Dialog as="div" className="relative z-40 md:hidden" onClose={setSidebarOpen}>
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-600 bg-opacity-75" />
          </Transition.Child>

          <div className="fixed inset-0 z-40 flex">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel className="relative flex w-full max-w-xs flex-1 flex-col bg-white pt-5 pb-4">
                <Transition.Child
                  as={Fragment}
                  enter="ease-in-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in-out duration-300"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <div className="absolute top-0 right-0 -mr-12 pt-2">
                    <button
                      type="button"
                      className="ml-1 flex h-10 w-10 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                      onClick={() => setSidebarOpen(false)}
                    >
                      <span className="sr-only">Close sidebar</span>
                      <XMarkIcon className="h-6 w-6 text-white" aria-hidden="true" />
                    </button>
                  </div>
                </Transition.Child>
                <div className="flex flex-shrink-0 items-center px-4">
                  <img className="h-8 w-auto" src={renoraIcon} alt="Your Company" />
                </div>
                <div className="mt-5 h-0 flex-1 overflow-y-auto">
                  <nav className="space-y-1 px-2">
                    {navigation.map((item) => (
                      <div
                        key={item.name}
                        onClick={item.onClick}
                        className={classNames(
                          item.current
                            ? "bg-gray-100 text-gray-900"
                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                          "group rounded-md py-2 px-2 flex items-center text-base font-medium"
                        )}
                      >
                        <item.icon
                          className={classNames(
                            item.current
                              ? "text-gray-500"
                              : "text-gray-400 group-hover:text-gray-500",
                            "mr-4 flex-shrink-0 h-6 w-6"
                          )}
                          aria-hidden="true"
                        />
                        {item.name}
                      </div>
                    ))}
                  </nav>
                </div>
              </Dialog.Panel>
            </Transition.Child>
            <div className="w-14 flex-shrink-0">
              {/* Dummy element to force sidebar to shrink to fit close icon */}
            </div>
          </div>
        </Dialog>
      </Transition.Root>

      {/* Static sidebar for desktop */}
      <div className="hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col">
        {/* Sidebar component, swap this element with another sidebar if you like */}
        <div className="flex flex-grow flex-col overflow-y-auto border-r border-gray-200 bg-white pt-5">
          <div className="flex flex-shrink-0 items-center px-4">
            <img className="h-8 w-auto" src={renoraIcon} alt="Your Company" />
          </div>
          <div className="mt-5 flex flex-grow flex-col">
            <nav className="flex-1 space-y-1 px-2 pb-4">
              {navigation.map((item) => (
                <div
                  key={item.name}
                  onClick={item.onClick}
                  className={classNames(
                    item.current
                      ? "bg-gray-100 text-gray-900"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                    "group rounded-md py-2 px-2 flex items-center text-sm font-medium hover:cursor-pointer"
                  )}
                >
                  <item.icon
                    className={classNames(
                      item.current ? "text-gray-500" : "text-gray-400 group-hover:text-gray-500",
                      "mr-3 flex-shrink-0 h-6 w-6"
                    )}
                    aria-hidden="true"
                  />
                  {item.name}
                </div>
              ))}
            </nav>
          </div>
        </div>
      </div>

      <div className="md:pl-64">
        <div className="mx-auto flex max-w-5xl md:max-w-6xl flex-col md:px-8 xl:px-0">
          <div className="sticky top-0 z-10 flex h-12 md:hidden flex-shrink-0 border-b border-gray-200 bg-white">
            <button
              type="button"
              className="border-r border-gray-200 px-4 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 md:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <span className="sr-only">Open sidebar</span>
              <Bars3BottomLeftIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>

          <main className="flex flex-col flex-1">
            <div className="py-6">
              <div className="flex flex-col px-4 sm:px-6 md:px-0">
                {/* Replace with your content */}
                {/* <div className="py-4">
                  <div className="h-96 rounded-lg border-4 border-dashed border-gray-200" />
                </div> */}
                <button
                  type="button"
                  className="border-r border-gray-200 px-4 mb-4 w-fit self-center  text-white rounded-lg bg-green-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 disabled:bg-gray-500"
                  disabled={assetsLoading}
                  onClick={() => refetchAssets()}
                >
                  <span>Sync</span>
                </button>
                <div
                  className="grid gap-2 grid-cols-1 md:grid-cols-[1fr_repeat(1,_40%)]"
                  // style={{ gridTemplateColumns: "1fr repeat(1, 40%)" }}
                >
                  <div className="grid h-min grid-cols-1 gap-4 sm:grid-cols-1 grid-flow-row-dense order-2 md:order-1">
                    <div className="hidden flex-row md:flex">
                      <div className="flex flex-[1] justify-center">Asset</div>
                      <div className="flex flex-1 justify-center">Amount</div>
                      <div className="flex flex-1 justify-center">Realized P&L</div>
                      <div className="flex flex-1 justify-center">Unrealized P&L</div>
                      <div className="flex flex-1 ml-2 justify-start">Total P&L</div>
                    </div>
                    {assetsLoading && <div> Loading... </div>}

                    {!assetsLoading &&
                      assets?.data?.map((asset: IAsset) => (
                        <div
                          key={asset.id}
                          className="flex flex-wrap flex-row  min-[1000px]:h-[80px] rounded-lg border border-gray-300 bg-white px-4 py-5 shadow-sm focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:border-gray-400"
                        >
                          <div className="flex-[1_1_10%] md:flex-[0.35]">
                            <img
                              className="h-10 w-10 rounded-full"
                              src={CryptoIcons[asset?.asset_name?.toLowerCase() || "btc"]}
                              alt=""
                            />
                          </div>
                          <div className="flex-[1_1_30%] ml-2 md:flex-[0.8]">
                            <div>
                              <p className="text-2xl md:text-sm font-medium text-gray-900">
                                {asset.asset_name}
                              </p>
                              <p className="truncate text-lg md:text-sm text-gray-500">
                                {asset.exchange}
                              </p>
                            </div>
                          </div>
                          <div className="flex flex-[1_1_50%] flex-col justify-center items-end md:justify-start md:items-start md:flex-1">
                            <p className="text-2xl md:text-sm font-medium text-gray-900">
                              {asset.amount} {asset.asset_name}
                            </p>
                            <p className="truncate text-sm text-gray-500">
                              $
                              {isConvertReady
                                ? formatNumber(
                                    convert[asset.asset_name as keyof CryptoConvert]?.USD(
                                      asset.amount
                                    )
                                  )
                                : 0}{" "}
                              USD
                            </p>
                          </div>
                          <div className="flex flex-[1_1_40%] h-20  items-center justify-start md:justify-start md:items-start md:h-auto md:flex-1 md:hidden">
                            <p className="text-lg font-medium text-gray-900">Realized P&L</p>
                          </div>

                          <div className="flex flex-[1_1_40%] flex-col justify-center items-end md:justify-start md:items-start md:flex-1">
                            <p className="text-sm font-medium text-gray-900">
                              {asset.realizedPl} USD
                            </p>
                            <p className="truncate text-sm text-gray-500">
                              {Math.floor(Math.random() * 100) + 1}%
                            </p>
                          </div>
                          <div className="flex flex-[1_1_40%] h-20  items-center justify-start md:justify-start md:items-start md:h-auto md:flex-1 md:hidden">
                            <p className="text-lg font-medium text-gray-900">Unrealized P&L</p>
                          </div>
                          <div className="flex flex-[1_1_40%] flex-col justify-center items-end md:justify-start md:items-start md:flex-1">
                            <p className="text-sm font-medium text-gray-900">
                              {asset.unrealizedPl} USD
                            </p>
                            <p className="truncate text-sm text-gray-500">
                              {Math.floor(Math.random() * 100) + 1}%
                            </p>
                          </div>
                          <div className="flex flex-[1_1_40%] h-20  items-center justify-start md:justify-start md:items-start md:h-auto md:flex-1 md:hidden">
                            <p className="text-lg font-medium text-gray-900">Total P&L</p>
                          </div>
                          <div className="flex flex-[1_1_40%] flex-col justify-center items-end md:justify-start md:items-start md:flex-1">
                            <p className="text-sm font-medium text-gray-900">{asset.totalPl} USD</p>
                            <p className="truncate text-sm text-gray-500">
                              {Math.floor(Math.random() * 100) + 1}%
                            </p>
                          </div>
                        </div>
                      ))}
                  </div>
                  <div className="h-min rounded-lg border-4 border-dashed border-gray-200 order-1 md:order-2">
                    <ReactECharts option={option} />
                    <div className="flex mt-8 flex-[1_1_40%] h-20 flex-col  items-center justify-start md:justify-center md:items-center md:h-auto md:flex-1 ">
                      <p className="text-lg font-medium text-gray-900">Net Worth: {netWorth}</p>
                      <p className="text-lg font-normal text-gray-500">
                        Realized Returns: {userDetails?.data?.realizedReturns}
                      </p>
                      <p className="text-lg font-normal text-gray-500">
                        Unrealized Returns: {userDetails?.data?.unrealizedReturns}
                      </p>
                    </div>
                  </div>
                </div>
                {/* /End replace */}
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  )

  async function readyConvert() {
    await convert.ready()
    setIsConvertReady(true)
  }

  function formatNumber(number: number) {
    return Number(number)?.toLocaleString("en-US", { maximumFractionDigits: 2 })
  }
}

export default AssetDashboard
