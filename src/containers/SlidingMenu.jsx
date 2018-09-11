import './SlidingMenu.css';

import React from 'react'
import {connect} from 'react-redux'
import PropTypes from 'prop-types';

import {VelocityTransitionGroup} from 'velocity-react'

import {Card, CardBody} from 'reactstrap';
import {Container, Row, Col} from 'reactstrap';
import {Nav, NavItem, NavLink} from 'reactstrap';
import {TabContent, TabPane} from 'reactstrap';

import {dispatchify} from '../utils'

import {hideMenus, ratePhoto} from '../actions'

import PhotoInformation from '../components/PhotoInformation';

import SlidingMenuNavigationContainer from './SlidingMenuNavigation';
import Settings from './Settings';


function Tab(name, contents) {
    return {name, contents};
}


function changeTab(tab, state) {
    return (state.activeTab !== tab) ? {activeTab: tab} : {};
}


const MenuTabs = ({photo, hideMenus, ratePhoto, activeTab, toggleTab}) => {
    const tabs = [
        Tab('Photo Info',
            <div>
                <PhotoInformation photo={photo} ratePhoto={ratePhoto} />
                <SlidingMenuNavigationContainer />
            </div>
        ),
        Tab('Settings', <Settings />),
    ];

    const tabNavs = tabs.map((tab, i) => {
        const tabId = (i + 1).toString();
        return (
            <NavItem key={i}>
                <NavLink
                        active={activeTab === tabId}
                        onClick={() => {toggleTab(tabId);}}
                >
                    {tab.name}
                </NavLink>
            </NavItem>
        )
    });

    const tabPanes = tabs.map((tab, i) => {
        const tabId = (i + 1).toString();
        return (
            <TabPane key={i} tabId={tabId}>
                {tab.contents}
            </TabPane>
        );
    });

    const contents = (
        <CardBody>
            <Nav tabs>
                {tabNavs}
                <NavItem key='x'>
                    <NavLink onClick={hideMenus} className='float-right'>x</NavLink>
                </NavItem>
            </Nav>
            <TabContent activeTab={activeTab}>
                {tabPanes}
            </TabContent>
        </CardBody>
    );

    return (
        <Container fluid={true}>
            <Row>
                <Col className="fullHeight" onClick={hideMenus} xs='1' sm='4' md='6' lg='7' xl='8' />
                <Col>
                    <Card className="almostFullHeight">
                        {contents}
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};


export class SlidingMenu extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            activeTab: '1'
        };
    }

    static enterAnimation = {animation: "transition.slideRightIn", duration: 400};
    static leaveAnimation = {animation: "transition.slideRightOut", duration: 200};

    toggle = (tab) => {
        this.setState((state) => changeTab(tab, state));
    }

    shouldComponentUpdate = (nextProps, nextState) => {
        return (
            this.props.photo !== nextProps.photo ||
            this.props.visible !== nextProps.visible ||
            this.state.activeTab !== nextState.activeTab
        );
    }

    render = () => {
        const {photo, visible, hideMenus, ratePhoto} = this.props;

        if (photo === null) {
            return <span />;
        }

        const layout = visible ? <MenuTabs photo={photo} hideMenus={hideMenus} ratePhoto={ratePhoto} activeTab={this.state.activeTab} toggleTab={this.toggle} /> : null;

        return (
            <VelocityTransitionGroup enter={SlidingMenu.enterAnimation} leave={SlidingMenu.leaveAnimation}>
                {layout}
            </VelocityTransitionGroup>
        );
    }
};


SlidingMenu.propTypes = {
    photo: PropTypes.object,
    visible: PropTypes.bool,
    hideMenus: PropTypes.func,
    ratePhoto: PropTypes.func,
};


const mapStateToProps = (state) => {
    return {
        photo: state.photos.current,
        visible: state.visibility.menu,
    }
};


const mapDispatchToProps = dispatchify({
    hideMenus,
    ratePhoto,
});


const SlidingMenuContainer = connect(mapStateToProps, mapDispatchToProps)(SlidingMenu);


export default SlidingMenuContainer;
