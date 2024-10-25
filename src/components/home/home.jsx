import { useLocation } from 'react-router-dom';
import Header from '../header/header.jsx';
import DynamicContent from '../DynamicContent.jsx';

function Home() {   
    return (
        <div>
            <Header />
            <main className="p-4">
                <DynamicContent />
            </main>
        </div>
    );
}

export default Home;