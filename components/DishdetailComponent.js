import React, { Component } from 'react';
import { Text, View, ScrollView, FlatList, Modal, StyleSheet, Button } from 'react-native';
import { Card, Icon, Input, Rating } from 'react-native-elements';
import { connect } from 'react-redux';
import { baseUrl } from '../shared/baseUrl';
import { postFavorite, postComment } from '../redux/ActionCreators';

const mapStateToProps = state => {
    return {
      dishes: state.dishes,
      comments: state.comments,
      favorites: state.favorites
    }
  }

const mapDispatchToProps = dispatch => ({
    postFavorite: (dishId) => dispatch(postFavorite(dishId)),
    postComment: (dishId, rating, author, comment) => dispatch(postComment(dishId, rating, author, comment))
})

function RenderComments(props) {
    const comments = props.comments;
    const renderCommentItem = ({ item, index }) => {
        return(
            <View key={index} style={{margin: 10}}>
                <Text style={{fontSize: 14}}>{item.comment}</Text>
                <Rating imageSize={20} style={{flex: 1, flexDirection: 'row'}} readonly startingValue={item.rating} />
                <Text style={{fontSize: 12}}>{'-- ' + item.author + ', ' + item.date} </Text>
            </View>
        );
    };

    return(
        <Card title="Comments">
            <FlatList data={comments}
                renderItem={renderCommentItem}
                keyExtractor={item => item.id.toString()}
            />
        </Card>
    );
}

function RenderDish(props) {

    const dish = props.dish;
    
        if (dish != null) {
            return(
                <Card
                featuredTitle={dish.name}
                image={{uri: baseUrl + dish.image}}>
                <Text style={{margin: 10}}>
                        {dish.description}
                    </Text>
                    <View style={{flex: 1, flexDirection: 'row', justifyContent: 'center'}}>
                        <Icon raised reverse name={ props.favorite ? 'heart' : 'heart-o' }
                            type='font-awesome' color='#f50' 
                            onPress={() => props.favorite ? console.log('Already favorite') : props.onPressFavorite()}
                        />
                        <Icon raised reverse name={'pencil'}
                            type='font-awesome' color="#512DA8"
                            onPress={() => props.onPressReview()}
                        />
                    </View>
                </Card>
            );
        }
        else {
            return(<View></View>);
        }
}

class DishDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            rating: 5, 
            author: '',
            comment: '',
            showModal: false
        }
    }

    markFavorite(dishId) {
        this.props.postFavorite(dishId);
    }

    toggleModal() {
        this.setState({showModal: !this.state.showModal});
    }

    static navigationOptions = {
        title: 'Dish Details'
    };

    resetForm() {
        this.setState({
            rating: 5, 
            author: '',
            comment: '',
            showModal: false
        });
    }

    handleForm(dishId, rating, author, comment) {
        this.props.postComment(
            this.props.navigation.getParam('dishId', ''),
            this.state.rating,
            this.state.author,
            this.state.comment
        );
    }

    
    render() {
        const dishId = this.props.navigation.getParam('dishId', '');
        return(
            <ScrollView>
                <RenderDish dish={this.props.dishes.dishes[+dishId]}
                    favorite={this.props.favorites.some(el => el === dishId)}
                    onPressFavorite={() => this.markFavorite(dishId)} 
                    onPressReview={() => this.toggleModal()}
                    />
                <RenderComments comments={this.props.comments.comments.filter((comment) => comment.dishId === dishId)} />
                <Modal animationType = {"slide"} transparent = {false}
                    visible = {this.state.showModal}
                    onDismiss = {() => this.toggleModal() }
                    onRequestClose = {() => this.toggleModal() }>
                    <View style = {styles.modal}>
                        <Rating showRating startingValue="{5}" fractions="{10}" ratingCount={5} onFinishRating={rating => this.setState({ rating: +rating })} />
                        <Input placeholder='Author'
                            leftIcon={ {type: 'font-awesome', name: 'user' } }
                            onChangeText={value => this.setState({ author: value })}
                        />
                        <Input
                            placeholder="Comment"
                            leftIcon={{ type: 'font-awesome', name: 'comment' }}
                            onChangeText={value => this.setState({ comment: value })}
                        />                 
                            <Button 
                                onPress={() =>{this.handleForm(); this.toggleModal(); this.resetForm();}}
                                title="Submit"
                                color="#512DA8"
                            />
                        <Text></Text>
                            <Button 
                                onPress={() =>{this.toggleModal(); this.resetForm();}}
                                title="Close" 
                                color="grey"
                            />
                    </View>
                </Modal>
            </ScrollView>
        );

    }
}

const styles = StyleSheet.create({
    modal: {
        justifyContent: 'center',
        margin: 20
     }
})

export default connect(mapStateToProps, mapDispatchToProps)(DishDetail);