import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Diff from './components/diff';
import Log from './components/log';

const App: React.FC = () => {
	return (
		<div>
			<BrowserRouter>
				<Switch>
					<Route exact path="/" component={Diff} />
					<Route exact path="/log" component={Log} />
					<Route
						exact
						path="/logadmin"
						component={() => <Log isAdmin={true} />}
					/>
				</Switch>
			</BrowserRouter>
		</div>
	);
};

export default App;
