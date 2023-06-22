def evaluate_score(y_test, y_pred) :
    from sklearn.metrics import mean_squared_error, r2_score
    import numpy as np
    
    mse = mean_squared_error(y_test, y_pred)  
    rmse = np.sqrt(mse)                       
    r2 = r2_score(y_test, y_pred)    
    
    print(f'mse : {mse :.3f}')
    print(f'rmse : {rmse :.3f}')
    print(f'r2 : {r2 :.3f}')
    
    
    return
