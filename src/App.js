import InputField from './searchInput';
import './App.css';

const App = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '50px' }}>
      <h1 className='title'>Pick Users</h1>
      <div style={{ width: '80%', maxWidth: '650px' }}>
        <InputField />
      </div>
    </div>
  );
}

export default App;
