import React from 'react'
import {View, Animated, PanResponder, Dimensions, LayoutAnimation, UIManager} from 'react-native'

const SCREEN_WIDTH = Dimensions.get('window').width
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.40
const SWIPE_OUT_DURATION = 150

class Deck extends React.Component {
    static defaultProps = {
        onSwipeRight: () => {
        },
        onSwipeLeft: () => {
        },
        renderNoMoreCards: () => {
        }
    }

    constructor(props) {
        super(props)
        this.position = new Animated.ValueXY()
        this.panResponder = PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onPanResponderMove: (event, gesture) => {
                this.position.setValue({x: gesture.dx, y: gesture.dy})
            },
            onPanResponderRelease: (event, gesture) => {
                if (gesture.dx > SWIPE_THRESHOLD) {
                    this.forceSwipe(1)
                }
                else if (gesture.dx < -SWIPE_THRESHOLD) {
                    this.forceSwipe(-1)
                } else {
                    this.resetPosition()
                }
            },
        })

        this.state = {index: 0}
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.data !== nextProps.data) {
            this.setState({index: 0})
        }
    }

    componentWillUpdate() {
        UIManager.setLayoutAnimationEnabledExperimental && UIManagerManager.setLayoutAnimationEnabledExperimental(true)
        LayoutAnimation.spring()
    }

    forceSwipe = (direction) => {
        return Animated.timing(this.position,
            {
                toValue: {x: direction * SCREEN_WIDTH, y: 0},
                duration: SWIPE_OUT_DURATION,
            })
            .start(() => this.onSwipeComplete(direction))
    }

    onSwipeComplete = (direction) => {
        const {onSwipeLeft, onSwipeRight, data} = this.props
        const item = data[this.state.index]

        direction > 0 ? onSwipeRight(item) : onSwipeLeft(item)
        this.position.setValue({x: 0, y: 0})
        this.setState((state) => ({index: state.index + 1}))
    }

    resetPosition = () => {
        return Animated.spring(this.position, {
            toValue: {x: 0, y: 0}
        }).start()
    }

    getCardStyle = () => {
        const position = this.position
        const rotate = position.x.interpolate({
            inputRange: [-SCREEN_WIDTH * 1.5, 0, SCREEN_WIDTH * 1.5],
            outputRange: ['-120deg', '0deg', '120deg']
        })

        return {
            ...position.getLayout(),
            transform: [{rotate}]
        }
    }


    renderCards = () => {
        if (this.state.index >= this.props.data.length) {
            return this.props.renderNoMoreCards()
        }

        return (
            this.props.data.map((item, index) => {
                if (index < this.state.index) {
                    // cards have already been swiped
                    return null
                }
                if (index === this.state.index) {
                    // first card on deck is swipeable
                    return (
                        <Animated.View {...this.panResponder.panHandlers}
                                       style={[this.getCardStyle(), styles.cardStyle]}
                                       key={item.id}>
                            {this.props.renderCard(item)}
                        </Animated.View>
                    )
                }
                // deck
                return (
                    <Animated.View style={[styles.cardStyle, {top: 10 * (index - this.state.index)}]} key={item.id}>
                        {this.props.renderCard(item)}
                    </Animated.View>
                )
            }).reverse()
        )
    }

    render() {
        return (
            <View>
                {this.renderCards()}
            </View>
        )
    }
}

const styles = {
    cardStyle: {
        position: 'absolute',
        width: '100%',
    }
}
export default Deck
