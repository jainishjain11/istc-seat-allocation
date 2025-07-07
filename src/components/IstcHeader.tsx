import Image from 'next/image';
import styles from './IstcHeader.module.css';

export default function IstcHeader() {
  return (
    <div className={styles.header}>
      {/* Left Logo */}
      <div className={styles['logo-container']}>
        <Image
          src="/images/csio-logo.jpg"
          alt="CSIR Logo"
          width={90}
          height={90}
          className={styles['logo-img']}
          priority
        />
      </div>

      {/* Center Text */}
      <div className={styles['center-text']}>
        <h1>INDO-SWISS TRAINING CENTRE</h1>
        <div className="sub">CSIR-Central Scientific Instruments Organisation</div>
        <div className="desc">
          (Council of Scientific &amp; Industrial Research, Ministry of Science and Technology, Govt. of India)
        </div>
        <div className="address">Sector 30-C, Chandigarh-160 030</div>
      </div>

      {/* Right Logo */}
      <div className={styles['logo-container']}>
        <Image
          src="/images/istc-logo.jpg"
          alt="ISTC Logo"
          width={90}
          height={90}
          className={styles['logo-img']}
          priority
        />
      </div>
    </div>
  );
}