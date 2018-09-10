import './SlidingMenu.css';

import React from 'react'
import {connect} from 'react-redux'
import PropTypes from 'prop-types';

import {VelocityTransitionGroup} from 'velocity-react'

import {Card, CardBlock} from 'reactstrap';
import {Container, Row, Col} from 'reactstrap';
import {Nav, NavItem, NavLink} from 'reactstrap';
import {TabContent, TabPane} from 'reactstrap';

import {dispatchify} from '../utils'

import {hideMenus, ratePhoto} from '../actions'

import PhotoInformation from '../components/PhotoInformation';

import Settings from './Settings';


function Tab(name, contents) {
    return {name, contents};
}


function changeTab(tab, state) {
    return (state.activeTab !== tab) ? {activeTab: tab} : {};
}


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

        const tabs = [
            Tab('Photo Info', <PhotoInformation photo={photo} ratePhoto={ratePhoto} />),
            Tab('Settings', <Settings />),
        ];

        const tabNavs = tabs.map((tab, i) => {
            const tabId = (i + 1).toString();
            return (
                <NavItem key={i}>
                    <NavLink
                            active={this.state.activeTab === tabId}
                            onClick={() => {this.toggle(tabId);}}
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
            <CardBlock>
                <Nav tabs>
                    {tabNavs}
                    <NavItem key='x'>
                        <NavLink onClick={hideMenus} className='float-right'>x</NavLink>
                    </NavItem>
                </Nav>
                <TabContent activeTab={this.state.activeTab}>
                    {tabPanes}
                </TabContent>
            </CardBlock>
        );

        const layout = visible
            ? (
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
            )
            : null;

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
