import React, { useEffect, useState } from 'react'
import { Menu, Transition } from '@headlessui/react'
import { Fragment } from 'react'
import { useThemeContext } from '../contexts/ThemeContext'
import { useUserContext } from '../contexts/UserContext'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import toast from 'react-hot-toast'
import { getNotifications } from '../fetchers/SanityFetchers'
import {
  changeNotificationReadStatus,
  deleteNotifications,
} from '../mutators/SanityMutators'
import Loader from './Loader'
import moment from 'moment'
import noProfileImage from '../assets/noProfileImage.png'
import { AiOutlineDelete } from 'react-icons/ai'
import { IconBell } from './icons/CustomIcons'
import { getUnsignedImagePath } from '../fetchers/s3'

const style = {
  background: `icon hover:bg-neutral-100 p-2 pb-0 rounded-xl cursor-pointer z-20`,
}
const errorToastStyle = {
  style: { background: '#ef4444', padding: '16px', color: '#fff' },
  iconTheme: { primary: '#ffffff', secondary: '#ef4444' },
}
const successToastStyle = {
  style: { background: '#10B981', padding: '16px', color: '#fff' },
  iconTheme: { primary: '#ffffff', secondary: '#10B981' },
}
const Notifications = () => {
  const { myUser } = useUserContext()
  const { dark, queryStaleTime } = useThemeContext()
  const queryClient = useQueryClient()
  const [isNotification, setIsNotification] = useState(false)
  const [allNotifications, setAllNotifications] = useState({})
  const { data, status } = useQuery(
    ['notification', myUser?.walletAddress],
    getNotifications(),
    {
      staleTime: queryStaleTime,
      enabled: Boolean(myUser?.walletAddress),
      onError: () => {
        toast.error('Error in getting notifications', errorToastStyle)
      },
      onSuccess: async (res) => {
        const checkNotification = res.filter((n) => n.status != true)
        if (checkNotification?.length > 0) {
          setIsNotification(true)
        }

        const unresolved = res.map(async (item) => {
          const obj = { ...item }
          if(item.from){
            const imgPath = await getUnsignedImagePath(item.from.profileImage)
            obj['profileImage'] = imgPath?.data.url
          }
          return obj
        })

        const resolvedPaths = await Promise.all(unresolved)

        if (resolvedPaths) {
          setAllNotifications(resolvedPaths)
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
        console.log(res)
      },
    }
  )

  const { mutate: deleteAllNotifications } = useMutation(
    (address) => deleteNotifications(address),
    {
      onError: () => {
        toast.error(
          'Error in deleting notifications. Refresh and try again',
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
      <div
        className={
          dark
            ? style.background + ' hover:bg-slate-800'
            : style.background + ' hover:bg-neutral-100'
        }
      >
        <Menu as="div" className="relative">
          <div>
            <Menu.Button>
              <IconBell />
              {isNotification && (
                <div className="absolute -top-2 -right-2">
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
                <h3 className="mb-2 pb-2 text-xl font-bold">Notifications</h3>
                <div>
                  <div
                    className={`rounded-lg p-2 ${
                      dark ? ' hover:bg-slate-600' : ' hover:bg-neutral-100'
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
                  allNotifications.length > 0 &&
                  allNotifications.map((notification, id) => {
                    return (
                      <div key={id}>
                        <Menu.Item>
                          <a
                            id={id}
                            href={notification.link}
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
                                src={notification?.profileImage}
                                alt="User"
                              />
                              <span className="wil-avatar__name">U</span>
                            </div>
                            <div className="ml-3 space-y-1 sm:ml-4">
                              <p className="text-sm font-medium ">
                                {notification?.from?.userName}
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
