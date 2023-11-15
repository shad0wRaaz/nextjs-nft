import moment from 'moment'
import Loader from './Loader'
import { Fragment } from 'react'
import toast from 'react-hot-toast'
import React, { useState } from 'react'
import { GoReport } from 'react-icons/go'
import { IconBell } from './icons/CustomIcons'
import { AiOutlineDelete } from 'react-icons/ai'
import { getImagefromWeb3 } from '../fetchers/s3'
import { Menu, Transition } from '@headlessui/react'
import { useUserContext } from '../contexts/UserContext'
import { useThemeContext } from '../contexts/ThemeContext'
import { getNotifications } from '../fetchers/SanityFetchers'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { changeNotificationReadStatus, deleteNotifications } from '../mutators/SanityMutators'
import { createAwatar } from '../utils/utilities'

const style = {
  background: `icon hover:bg-neutral-100 p-2 pb-0 rounded-xl cursor-pointer z-20`,
}

const Notifications = () => {
  const { errorToastStyle, successToastStyle } = useThemeContext();
  const { myUser } = useUserContext()
  const { dark, queryStaleTime } = useThemeContext()
  const queryClient = useQueryClient()
  const [isNotification, setIsNotification] = useState(false)
  const { data, status } = useQuery(
    ['notification', myUser?.walletAddress],
    getNotifications(),
    {
      staleTime: queryStaleTime,
      enabled: Boolean(myUser?.walletAddress),
      onError: () => {
        // toast.error('Error in getting notifications', errorToastStyle)
      },
      onSuccess: async (res) => {
        // console.log(res)
        const checkNotification = res.filter((n) => n.status != true)
        if (checkNotification?.length > 0) {
          setIsNotification(true)  ///are there any new notifications?
        }
      },
    }
  )

  const { mutate: markedRead, status: markedReadStatus } = useMutation(
    (notificationId) => changeNotificationReadStatus(notificationId),
    {
      onError: () => {},
      onSuccess: (res) => {
        queryClient.invalidateQueries('notification')
      },
    }
  )

  const { mutate: deleteAllNotifications } = useMutation(
    (address) => deleteNotifications(address),
    {
      onError: () => {
        toast.error(
          'Error in deleting notifications. Refresh and try again.',
          errorToastStyle
        )
      },
      onSuccess: () => {
        queryClient.invalidateQueries('notification')
        setIsNotification(false)
        toast.success('All notification has been deleted.', successToastStyle)
      },
    }
  )

  return (
    <>
      <div>
        <Menu as="div" className="relative">
          <div className={
          dark
            ? style.background + ' hover:bg-slate-800'
            : style.background + ' hover:bg-neutral-100 text-white hover:text-black'
        }>
            <Menu.Button>
              <div className={` ${!dark && 'text-black'}`}><IconBell /></div>
              {isNotification && (
                <div className="absolute -top-0 -right-0">
                  <span className="flex h-3 w-3">
                    <span
                      className={`absolute inline-flex h-full w-full animate-ping rounded-full ${
                        dark ? ' bg-sky-400' : ' bg-rose-600'
                      } opacity-75`}
                    ></span>
                    <span
                      className={`relative inline-flex h-3 w-3 rounded-full ${
                        dark ? ' bg-sky-400' : ' bg-rose-600'
                      }`}
                    ></span>
                  </span>
                </div>
              )}
            </Menu.Button>
          </div>

          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items
              className={`absolute right-0 mt-2 w-96 origin-top-right divide-y  rounded-3xl ${
                dark
                  ? ' divide-slate-600 bg-slate-700'
                  : ' divide-gray-100 bg-white'
              } p-7 pb-2 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none`}
            >
              <div className="flex  justify-between">
                <h3 className="mb-2 pb-2 text-md font-bold">Notifications</h3>
                <div>
                  <div
                    className={`rounded-lg p-2 cursor-pointer transition ${
                      dark ? ' hover:bg-red-500' : ' hover:bg-red-500 hover:text-white'
                    } `}
                    onClick={() => deleteAllNotifications(myUser.walletAddress)}
                  >
                    <AiOutlineDelete />
                  </div>
                </div>
              </div>
              <div className="notificationbox max-h-[425px] overflow-y-auto overflow-x-hidden py-5">
                {status === 'loading' && <Loader />}
                {status === 'success' && data.length == 0 && (
                  <p>No new notifications.</p>
                )}
                {status === 'success' &&
                  data.length > 0 &&
                  data.map((notification, id) => {
                    return (
                      <div key={id}>
                        <Menu.Item>
                          <a
                            id={id}
                            href={
                              notification.type == "TYPE_SIX" ? `/nfts/${notification.item?._ref}` : 
                              notification.type == "TYPE_ONE" ? `/collections/${notification.item?._ref}` : 
                              notification.type == "TYPE_NINE" ? `/user/referrals` : '#'}
                            onClick={() => markedRead(notification._id)}
                            className={`relative flex rounded-lg p-2 pr-4 transition duration-150 ease-in-out ${
                              dark
                                ? ' hover:bg-slate-600'
                                : ' hover:bg-gray-100'
                            } focus:outline-none focus-visible:ring focus-visible:ring-orange-500 focus-visible:ring-opacity-50`}
                          >
                            <div className="wil-avatar relative inline-flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full font-semibold uppercase text-gray-900 shadow-inner ring-1 ring-white sm:h-12 sm:w-12">
                              <img
                                className="absolute inset-0 h-full w-full rounded-full object-cover"
                                src={Boolean(notification?.from.web3imageprofile) ? getImagefromWeb3(notification?.from.web3imageprofile) : createAwatar(notification?.from.walletAddress)}
                                alt="User"
                              />
                            </div>
                            <div className="ml-3 sm:ml-4">
                              <p className="font-semibold text-sm my-0">
                                {notification?.from?.userName != "Unnamed" ? 
                                notification?.from?.userName : 
                                <>
                                  {notification?.from?.walletAddress.slice(0,8)}...{notification?.from?.walletAddress.slice(-8)}
                                </>}
                              </p>
                              <p className="text-xs sm:text-sm">
                                {notification.event}
                              </p>
                              <p
                                className={`text-xs ${
                                  dark ? ' text-neutral-300' : 'text-gray-800'
                                }`}
                              >
                                {moment(notification._createdAt).fromNow()}
                              </p>
                            </div>
                            {!notification.status && (
                              <span className="absolute right-1 top-1/2 h-2 w-2 -translate-y-1/2 transform rounded-full bg-blue-500"></span>
                            )}
                          </a>
                        </Menu.Item>
                        <div className="mb-4"></div>
                      </div>
                    )
                  })}
              </div>
            </Menu.Items>
          </Transition>
        </Menu>
      </div>
    </>
  )
}

export default Notifications
