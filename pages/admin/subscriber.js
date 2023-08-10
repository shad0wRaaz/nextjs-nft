
import axios from 'axios';
import { useState } from 'react';
import { useQuery } from 'react-query';
import { toast } from 'react-hot-toast';
import { config } from '../../lib/sanityClient';
import { useThemeContext } from '../../contexts/ThemeContext';
import { useSettingsContext } from '../../contexts/SettingsContext';
import AdminPageWrapper from '../../components/admin/AdminPageWrapper'
import { WelcomeTemplate } from '../../emails/templates/Welcome';


const subscriber = () => {
  const [subscribers, setSubscribers] = useState([]);
  const [selectedSubscriber, setSelectedSubscriber] = useState([]);
  const [loading, setLoading] = useState(false);
  const { HOST } = useSettingsContext();
  const { errorToastStyle, successToastStyle } = useThemeContext();

  const sendEmail = async (e) => {
    e.preventDefault();

    const subject = e.target.subject.value;
    const emailBody = e.target.message.value;
    setLoading(true);

    const {data} = await axios.post(`${HOST}/api/email/send`,
    {
      emailBody: WelcomeTemplate(),
      to: ['to-arun@live.com', 'to.2.arun@gmail.com'],
      subject,
    },
    {
      header: {
        'Content-Type': 'application/x-www-form-urlencoded',
      }
    });
    if(data.message === "success"){
      e.target.subject.value = '';
      e.target.message.value = '';
      toast.success("Email sent to all subscribers", successToastStyle);
    }else{
      toast.error('Error in sending email', errorToastStyle);
    }
    setLoading(false);
  }

  const {data, status} = useQuery(
    ['subscriber'],
    () => async() => {
      const query = await config.getDocument('09f0e4f9-76ca-4ca0-b168-ed1a97cf6958');
      const allemails = await JSON.parse(query.email);

      const emails = allemails.map(em => em.e)
      setSubscribers(emails);
      setSelectedSubscriber(emails);
    },
    {
      enabled: true,
    }
  )


  return (
    <AdminPageWrapper title="Subscibers">
      <h2 className="font-bold mb-4 text-2xl">Email Subscriber</h2>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="col-span-3">
          <form onSubmit={sendEmail}>
            <div className="flex flex-col gap-2">
              <input name="subject" type="text" className="p-4 border rounded-xl border-slate-700 bg-slate-800" placeholder="Enter Email Subject"/>
              <textarea name="message" rows={10} className="p-4 border rounded-xl border-slate-700 bg-slate-800" placeholder='Enter email body'></textarea>
              <button type="submit" className="gradBlue w-fit px-6 py-3 rounded-xl m-auto">
                {loading ? 'Sending..' : 'Send Email'}
              </button>

            </div>
          </form>
        </div>
        <div>
          <div className="border rounded-xl bg-slate-700  border-slate-800 p-4">
            <p className="mb-4">All Subscribers: {subscribers.length}</p>
            {subscribers?.map(sub => 
              <p className=" p-2 pl-4 rounded-md border-slate-600 border mb-2 text-sm" key={sub}>{sub}</p>
              )}
          </div>
        </div>
      </div>

    </AdminPageWrapper>
  )
}

export default subscriber