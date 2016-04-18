let rideRecords = [ 
    { id: 1, riderName:'Nick', routeName:'Long Westerville', distanceInMiles:22, timeToCompleteInHours:1.5},
    {id: 2,  riderName:'Nick', routeName:'Long New Albany', distanceInMiles:22, timeToCompleteInHours:1.25}
];


//without the props.children the properties aren't passed on to the inner elements
const RideRecord = (props) => (
	<div className="rideRecord">
	<h2 className="riderName">
	{props.riderName } : {props.routeName}
    </h2>
	{props.children}
    </div>
);

const RideRecordList = (props) => (
	<div className="rideRecordList">
    { props.rideRecords.map(rideRecord => (
	    <RideRecord riderName={ rideRecord.riderName } routeName={rideRecord.routeName} key={rideRecord.id} >
	    <div> <span> { rideRecord.riderName } rode the { rideRecord.routeName } route,  a route of { rideRecord.distanceInMiles} miles, in {rideRecord.timeToCompleteInHours } hours.</span></div>
	    </RideRecord>
    )) }
    </div>
);

const RideRecordForm = (props) => ( 
	<form className="rideRecordForm" 
    onSubmit={ (e) => { 
	e.preventDefault(); 
	props.onRideRecordSubmit();
    }}  
	>
	<div><label>Rider Name:
	<input type="text"
    name="name"
    placeholder="Your name"
    value={ props.riderName }
    onChange={ (e) => 
	       props.onRiderNameChange(e.target.value) }
	/>
	</label></div>
	<div><label>Route Name:
	<input type="text"
    name="route"
    placeholder="Route Name..."
    value={props.routeName}
    onChange={ (e) => 
	       props.onRideRouteChange(e.target.value) }
	/>
	</label></div>
	<div><label>Distance in miles:
	<input type="number"
    name="Distance"
    placeholder="Distance In Miles..."
    value={props.distanceInMiles}
    onChange={ (e) => 
	       props.onDistanceInMilesChange(e.target.value) }
	/>
	</label></div>
	<div><label>Time to complete:
	<input type="number"
    name="Time"
    placeholder="Time to complete in hours"
    value={props.timeToCompleteInHours}
    onChange={ (e) => 
	       props.onTimeToCompleteInHoursChange(e.target.value) }
	/>
	</label></div>

	<button>Create</button>
	</form>
);


const { createClass, PropTypes } = React;

const RideRecordBox = createClass({
    contextTypes: { 
	store: PropTypes.object
    },
    componentDidMount() {
	const { store } = this.context;
	this.unsubscribe = store.subscribe( () => this.forceUpdate() )
    },
    componentWillUnmount() {
	this.unsubscribe(); 
    },
    render() {
	const { items, riderName, routeName, distanceInMiles, timeToCompleteInHours } = this.context.store.getState();
	
	return (
		<div className="RideRecordBox">
		<h1>Ride Records</h1>
		<RideRecordForm 
	    riderName={ riderName } 
	    routeName={ routeName } 
	    distanceInMiles = {distanceInMiles}
	    timeToCompleteInHours = { timeToCompleteInHours }
	    onRideRecordSubmit={ () =>
				 dispatch(addRideRecord({riderName,routeName,distanceInMiles,timeToCompleteInHours})) }
	    
	    onRiderNameChange={ (riderName) =>
				dispatch(riderNameChange(riderName)) }

	    onRideRouteChange={ (routeName) =>
				dispatch(routeNameChange(routeName)) }

	    onDistanceInMilesChange={ (routeName) =>
				      dispatch(distanceInMilesChange(routeName)) }

	    onTimeToCompleteInHoursChange={ (routeName) =>
					    dispatch(timeToCompleteInHoursChange(routeName)) }
	    
		/>
		<RideRecordList rideRecords={ items } />
		</div>
	);
    }
});

const ADD_RIDE_RECORD			= Symbol('ADD_RIDE_RECORD');
const RIDER_NAME_CHANGE			= Symbol('RIDER_NAME_CHANGE');
const RIDE_ROUTE_CHANGE			= Symbol('RIDE_ROUTE_CHANGE');
const DISTANCE_IN_MILES_CHANGE		= Symbol('DISTANCE_IN_MILES_CHANGE');
const TIME_TO_COMPLETE_IN_HOURS_CHANGE	= Symbol('TIME_TO_COMPLETE_IN_HOURS_CHANGE');

const addRideRecord = (rideRecord={ riderName:'', routeName:'',distanceInMiles:0,timeToCompleteInHours:0}) => ({
    type: ADD_RIDE_RECORD,
    rideRecord
});

const riderNameChange = (riderName='Nick') => ({
    type: RIDER_NAME_CHANGE,
    riderName
}); 

const routeNameChange = (routeName = 'Long') => ({
    type: RIDE_ROUTE_CHANGE ,
    routeName
});

const distanceInMilesChange = (distanceInMiles=0) => ({
    type: DISTANCE_IN_MILES_CHANGE,
    distanceInMiles
}); 

const timeToCompleteInHoursChange = (timeToCompleteInHours = 0) => ({
    type: TIME_TO_COMPLETE_IN_HOURS_CHANGE ,
    timeToCompleteInHours
});


const rideRecordsReducer = (state={
    items:[],
    riderName:'',
    routeName: '',
    distanceInMiles:0,
    timeToCompleteInHours:0,
    cumulativeRecord: {
	totalMileage: 0,
	totalTime: 0
    }
}, action) => {
    switch (action.type) {
    case ADD_RIDE_RECORD:
        return {
		...state,
            items: [...state.items, {id: Math.random(), ...action.rideRecord}]
        };
    case RIDER_NAME_CHANGE:
        return {

		...state,
            riderName: action.riderName
        };
    case RIDE_ROUTE_CHANGE:
        return {
		...state,
            routeName: action.routeName
	};
    case DISTANCE_IN_MILES_CHANGE:
	return {
		...state,
	    distanceInMiles: action.distanceInMiles
	};
    case TIME_TO_COMPLETE_IN_HOURS_CHANGE:
	return {
		...state,
	    timeToCompleteInHours: action.timeToCompleteInHours
	};

    default:
        return state;
    }
};

const { createStore } = Redux;

const store = createStore(rideRecordsReducer);

const { getState, dispatch } = store;

//console.log(getState());
//load our array that we created up at the top
rideRecords.map( rideRecord => dispatch(addRideRecord(rideRecord)));

const { Provider} = ReactRedux;

ReactDOM.render(
	<Provider store = {store}>
	<RideRecordBox />
	</Provider>,
    document.querySelector('#content')
);
