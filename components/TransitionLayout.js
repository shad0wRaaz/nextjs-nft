import { motion } from 'framer-motion';
import { PageTransition } from 'next-page-transitions';
import { useRouter } from 'next/router';

const transitionStyles = {
  enter: {
    opacity: 0,
  },
  enterActive: {
    opacity: 1,
    transition: {
      duration: 0.3,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.3,
    },
  },
};


const TransitionLayout = ({children}) => {
    const router = useRouter();
  return (
    <PageTransition
    timeout={500}
    classNames="page-transition"
    monkeyPatchScrolling
    loadingDelay={500}
    loadingTimeout={{
      enter: 500,
      exit: 0,
    }}
    loadingClassNames="loading-indicator"
  >
    <motion.div
      key={router.route}
      initial="enter"
      animate="enterActive"
      exit="exit"
      variants={transitionStyles}
    >
      {children}
    </motion.div>
  </PageTransition>
);
}

export default TransitionLayout