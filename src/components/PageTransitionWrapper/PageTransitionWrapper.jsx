import { motion } from "framer-motion";

const MotionDiv = motion.div;

const PageTransitionWrapper = ({ children }) => {
  return (
    <MotionDiv
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25, ease: "easeInOut" }}
    >
      {children}
    </MotionDiv>
  );
};

export default PageTransitionWrapper;
