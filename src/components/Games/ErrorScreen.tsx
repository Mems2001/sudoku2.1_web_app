import { motion } from 'framer-motion'
import { ErrorModalProps } from '../../assets/animations'

function ErrorScreen() {
    return (
        <motion.div {...ErrorModalProps} className="error-screen"></motion.div>
    )
}

export default ErrorScreen